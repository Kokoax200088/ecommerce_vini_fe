import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { filter, forkJoin, of, switchMap } from 'rxjs';
import { AlcolicoEliminaConferma } from '../../dialogs/alcolico-elimina-conferma/alcolico-elimina-conferma';
import { AuthServices } from '../../core/services/auth-services';
import { AlcolicoServices } from '../../core/services/alcolico-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { NotificationServices } from '../../core/services/notification-services';
import { CantinaALcolico } from '../../core/models/cantina';
import { AlcolicoModel } from '../../core/models/alcolico';

@Component({
  selector: 'app-alcolico-elimina',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './alcolico-elimina.html',
  styleUrl: './alcolico-elimina.css',
})
export class AlcolicoElimina {
  @Input() cantinaAlcolico?: CantinaALcolico;
  @Input() idCantina?: number;
  @Input() alcolico?: AlcolicoModel;

  public readonly auth = inject(AuthServices);
  private readonly dialog = inject(MatDialog);
  private readonly alcolicoService = inject(AlcolicoServices);
  private readonly cantinaService = inject(CantinaServices);
  private readonly notification = inject(NotificationServices);

  apri(event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(AlcolicoEliminaConferma, {
      width: '450px',
      data: {
        message: this.messaggio()
      }
    });

    dialogRef.afterClosed().pipe(
      filter(confermato => confermato === true)
    ).subscribe(() => this.eseguiDelete());
  }

  private nomeAlcolico(): string {
    return this.cantinaAlcolico?.alcolico?.nome ?? this.alcolico?.nome ?? '';
  }

  private messaggio(): string {
    return this.cantinaAlcolico
      ? `Sei sicuro di voler rimuovere ${this.nomeAlcolico()} da questa cantina?`
      : `Sei sicuro di voler eliminare ${this.nomeAlcolico()} dal catalogo? Verra' rimosso anche dalle cantine che lo contengono.`;
  }

  private eseguiDelete(): void {
    if (this.cantinaAlcolico) {
      this.rimuoviDallaCantina();
      return;
    }

    this.eliminaDalCatalogo();
  }

  private rimuoviDallaCantina(): void {
    this.cantinaService.deleteCantinaAlcolico(this.cantinaAlcolico!.id).subscribe({
      next: () => {
        this.cantinaService.listAlcolici(this.idCantina);
        this.alcolicoService.delete(this.cantinaAlcolico!.alcolico.id);
        this.notification.success('Alcolico rimosso dalla cantina');
      },
      error: (err) => {
        console.error('Errore durante la rimozione dell\'alcolico', err);
        this.notification.error('Impossibile rimuovere l\'alcolico dalla cantina');
      }
    });
  }

  private eliminaDalCatalogo(): void {
    const idAlcolico = this.alcolico!.id;

    this.cantinaService.getCantinaAlcolicoByFilter(undefined, idAlcolico).pipe(
      switchMap((righe) => {
        const scollegamenti = (righe ?? []).map(riga => this.cantinaService.deleteCantinaAlcolico(riga.id));
        return scollegamenti.length === 0 ? of([]) : forkJoin(scollegamenti);
      }),
      switchMap(() => this.alcolicoService.delete(idAlcolico))
    ).subscribe({
      next: () => {
        this.notification.success('Alcolico eliminato dal catalogo');
      },
      error: (err) => {
        console.error('Errore nella cancellazione alcolico', err);
        this.notification.error('Impossibile eliminare: l\'alcolico e\' collegato a ordini, carrelli o altri elementi.');
      }
    });
  }
}
