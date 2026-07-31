import { Component, Input, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { filter, forkJoin, of, switchMap } from 'rxjs';
import { UploadImage } from '../upload-image/upload-image';
import { AuthServices } from '../../core/services/auth-services';
import { NotificationServices } from '../../core/services/notification-services';
import { UtilitiesServices } from '../../core/services/utilities-services';
import { ImmagineModel, UploadImageService } from '../../core/services/uploadImage';
import { AlcolicoModel } from '../../core/models/alcolico';

@Component({
  selector: 'app-alcolico-immagine',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './alcolico-immagine.html',
  styleUrl: './alcolico-immagine.css',
})
export class AlcolicoImmagine {
  @Input() alcolico!: AlcolicoModel;

  public readonly auth = inject(AuthServices);
  private readonly util = inject(UtilitiesServices);
  private readonly uploadImageService = inject(UploadImageService);
  private readonly notification = inject(NotificationServices);

  apri(event: MouseEvent): void {
    event.stopPropagation();

    this.uploadImageService.list<ImmagineModel>('alcolico', 'idAlcolico', this.alcolico.id).subscribe({
      next: (immagini) => this.apriDialog(immagini ?? []),
      error: () => this.apriDialog([])
    });
  }

  private apriDialog(precedenti: ImmagineModel[]): void {
    const attuale = precedenti[precedenti.length - 1];

    const dialogRef = this.util.openDialog(UploadImage, {
      entity: 'alcolico',
      idParamName: 'id_alcolico',
      id: this.alcolico.id,
      titolo: this.alcolico.nome,
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
        this.notification.error('Impossibile aggiornare l\'immagine dell\'alcolico');
      }
    });
  }

  private rimuoviPrecedenti(precedenti: ImmagineModel[]) {
    if (precedenti.length === 0) {
      return of([]);
    }

    return forkJoin(precedenti.map(immagine => this.uploadImageService.delete('alcolico', immagine.id)));
  }
}
