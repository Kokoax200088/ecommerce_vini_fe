import { Component, inject, Input } from '@angular/core';
import { AuthServices } from '../../core/services/auth-services';
import { MatDialog } from '@angular/material/dialog';
import { CantinaServices } from '../../core/services/cantina-services';
import { NotificationServices } from '../../core/services/notification-services';
import { Box } from '../../core/models/box';
import { filter } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { BoxServices } from '../../core/services/box-services';

@Component({
  selector: 'app-box-elimina',
  imports: [MatIcon],
  templateUrl: './box-elimina.html',
  styleUrl: './box-elimina.css',
})
export class BoxElimina {
  @Input() box!: Box;
  @Input() idCantina!: number; //ma non serve qui no?

  public readonly auth = inject(AuthServices);
  private readonly dialog = inject(MatDialog);
  private readonly boxService = inject(BoxServices);
  private readonly cantinaService = inject(CantinaServices);
  private readonly notification = inject(NotificationServices);

  apri(event: MouseEvent): void {
      event.stopPropagation();
  
      const dialogRef = this.dialog.open(BoxElimina, { //crea dialog
        width: '450px',
        data: {
          message: `Sei sicuro di voler rimuovere ${this.box?.nome} da questa cantina?`
        }
      });
  
      dialogRef.afterClosed().pipe(
        filter(confermato => confermato === true)
      ).subscribe(() => this.eseguiDelete());
    }
  
    private eseguiDelete(): void {
      this.boxService.delete(this.box.id).subscribe({
        next: () => {
          this.boxService.list();
          this.notification.success('Box rimosso dalla cantina');
        },
        error: (err) => {
          console.error('Errore durante la rimozione del box', err);
          this.notification.error('Impossibile rimuovere il box dalla cantina');
       }
      });
    }

}
