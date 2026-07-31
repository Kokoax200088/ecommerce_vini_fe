import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { AlcolicoEliminaConferma } from '../../dialogs/alcolico-elimina-conferma/alcolico-elimina-conferma';
import { AuthServices } from '../../core/services/auth-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { NotificationServices } from '../../core/services/notification-services';
import { CantinaALcolico } from '../../core/models/cantina';

@Component({
  selector: 'app-alcolico-elimina',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './alcolico-elimina.html',
  styleUrl: './alcolico-elimina.css',
})
export class AlcolicoElimina {
  @Input() cantinaAlcolico!: CantinaALcolico;
  @Input() idCantina!: number;

  public readonly auth = inject(AuthServices);
  private readonly dialog = inject(MatDialog);
  private readonly cantinaService = inject(CantinaServices);
  private readonly notification = inject(NotificationServices);

  apri(event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(AlcolicoEliminaConferma, {
      width: '450px',
      data: {
        message: `Sei sicuro di voler rimuovere ${this.cantinaAlcolico?.alcolico?.nome} da questa cantina?`
      }
    });

    dialogRef.afterClosed().pipe(
      filter(confermato => confermato === true)
    ).subscribe(() => this.eseguiDelete());
  }

  private eseguiDelete(): void {
    this.cantinaService.deleteCantinaAlcolico(this.cantinaAlcolico.id).subscribe({
      next: () => {
        this.cantinaService.listAlcolici(this.idCantina);
        this.notification.success('Alcolico rimosso dalla cantina');
      },
      error: (err) => {
        console.error('Errore durante la rimozione dell\'alcolico', err);
        this.notification.error('Impossibile rimuovere l\'alcolico dalla cantina');
      }
    });
  }
}
