import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { DegustazioneForm } from '../../dialogs/degustazione-form/degustazione-form';
import { DegustazioneEliminaConferma } from '../../dialogs/degustazione-elimina-conferma/degustazione-elimina-conferma';
import { AuthServices } from '../../core/services/auth-services';
import { DegustazioneServices } from '../../core/services/degustazione-services';
import { NotificationServices } from '../../core/services/notification-services';
import { UtilitiesServices } from '../../core/services/utilities-services';

@Component({
  selector: 'app-degustazione-azioni',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './degustazione-azioni.html',
  styleUrl: './degustazione-azioni.css',
})
export class DegustazioneAzioni {
  @Input() degustazione: any;
  @Input() idCantina!: number;
  @Output() aggiornata = new EventEmitter<void>();

  public readonly auth = inject(AuthServices);
  private readonly dialog = inject(MatDialog);
  private readonly util = inject(UtilitiesServices);
  private readonly degustazioneService = inject(DegustazioneServices);
  private readonly notification = inject(NotificationServices);

  apriModifica(event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.util.openDialog(DegustazioneForm,
      {
        idCantina: this.idCantina,
        degustazione: this.degustazione
      },
      {
        width: '900px',
        maxWidth: '90vw',
        height: 'auto',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms'
      });

    dialogRef.afterClosed().pipe(
      filter((esito: any) => esito?.salvato === true)
    ).subscribe(() => this.aggiornata.emit());
  }

  apriElimina(event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DegustazioneEliminaConferma, {
      width: '450px',
      data: {
        message: `Sei sicuro di voler eliminare ${this.degustazione?.nome}?`
      }
    });

    dialogRef.afterClosed().pipe(
      filter(confermato => confermato === true)
    ).subscribe(() => this.eseguiDelete());
  }

  private eseguiDelete(): void {
    this.degustazioneService.delete(this.degustazione.id).subscribe({
      next: () => {
        this.notification.success('Degustazione eliminata');
        this.aggiornata.emit();
      },
      error: (err) => {
        console.error('Errore durante l\'eliminazione della degustazione', err);
        this.notification.error('Impossibile eliminare la degustazione');
      }
    });
  }
}
