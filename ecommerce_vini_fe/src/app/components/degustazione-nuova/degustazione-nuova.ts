import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { DegustazioneForm } from '../../dialogs/degustazione-form/degustazione-form';
import { AuthServices } from '../../core/services/auth-services';
import { UtilitiesServices } from '../../core/services/utilities-services';

@Component({
  selector: 'app-degustazione-nuova',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './degustazione-nuova.html',
  styleUrl: './degustazione-nuova.css',
})
export class DegustazioneNuova {
  @Input() idCantina!: number;
  @Output() salvata = new EventEmitter<number | undefined>();

  public readonly auth = inject(AuthServices);
  private readonly util = inject(UtilitiesServices);

  apri(): void {
    const dialogRef = this.util.openDialog(DegustazioneForm,
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

    dialogRef.afterClosed().pipe(
      filter((esito: any) => esito?.salvato === true)
    ).subscribe((esito: any) => this.salvata.emit(esito?.id));
  }
}
