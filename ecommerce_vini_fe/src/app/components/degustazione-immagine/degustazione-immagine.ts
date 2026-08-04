import { Component, Input, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { filter, forkJoin, of, switchMap } from 'rxjs';
import { UploadImage } from '../upload-image/upload-image';
import { AuthServices } from '../../core/services/auth-services';
import { NotificationServices } from '../../core/services/notification-services';
import { UtilitiesServices } from '../../core/services/utilities-services';
import { ImmagineModel, UploadImageService } from '../../core/services/uploadImage';

@Component({
  selector: 'app-degustazione-immagine',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './degustazione-immagine.html',
  styleUrl: './degustazione-immagine.css',
  host: {
    '[class.inline]': 'inline'
  },
})
export class DegustazioneImmagine {
  @Input() idDegustazione!: number;
  @Input() nome: string = '';
  @Input() inline: boolean = false;

  public readonly auth = inject(AuthServices);
  private readonly util = inject(UtilitiesServices);
  private readonly uploadImageService = inject(UploadImageService);
  private readonly notification = inject(NotificationServices);

  apri(event: MouseEvent): void {
    event.stopPropagation();

    if (this.idDegustazione == null) {
      this.notification.error('Salva prima la degustazione, poi carica l\'immagine');
      return;
    }

    this.uploadImageService.list<ImmagineModel>('degustazione', 'idDegustazione', this.idDegustazione).subscribe({
      next: (immagini) => this.apriDialog(immagini ?? []),
      error: () => this.apriDialog([])
    });
  }

  private apriDialog(precedenti: ImmagineModel[]): void {
    const attuale = precedenti[precedenti.length - 1];

    const dialogRef = this.util.openDialog(UploadImage, {
      entity: 'degustazione',
      idParamName: 'id_degustazione',
      id: this.idDegustazione,
      titolo: this.nome,
      imageUrl: attuale?.url ?? null
    });

    dialogRef.afterClosed().pipe(
      filter(salvata => salvata === true),
      switchMap(() => this.rimuoviPrecedenti(precedenti))
    ).subscribe({
      next: () => {
        this.notification.success('Immagine aggiornata');
      },
      error: (err) => {
        console.error('Errore durante l\'aggiornamento dell\'immagine', err);
        this.notification.error('Impossibile aggiornare l\'immagine della degustazione');
      }
    });
  }

  private rimuoviPrecedenti(precedenti: ImmagineModel[]) {
    if (precedenti.length === 0) {
      return of([]);
    }

    return forkJoin(precedenti.map(immagine => this.uploadImageService.delete('degustazione', immagine.id)));
  }
}
