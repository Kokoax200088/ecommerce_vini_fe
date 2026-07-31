import { Component, Input, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AlcolicoNuovoForm } from '../../dialogs/alcolico-nuovo-form/alcolico-nuovo-form';
import { AuthServices } from '../../core/services/auth-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { UtilitiesServices } from '../../core/services/utilities-services';

@Component({
  selector: 'app-alcolico-nuovo',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './alcolico-nuovo.html',
  styleUrl: './alcolico-nuovo.css',
})
export class AlcolicoNuovo {
  @Input() idCantina!: number;

  public readonly auth = inject(AuthServices);
  private readonly util = inject(UtilitiesServices);
  private readonly cantinaService = inject(CantinaServices);

  apri(): void {
    const dialogRef = this.util.openDialog(AlcolicoNuovoForm,
      {
        idCantina: this.idCantina
      },
      {
        width: '900px',
        maxWidth: '90vw',
        height: 'auto',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms'
      });

    dialogRef.afterClosed().subscribe((creato) => {
      if (creato) {
        this.cantinaService.listAlcolici(this.idCantina);
      }
    });
  }
}
