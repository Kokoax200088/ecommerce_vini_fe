import { Component, inject, OnInit } from '@angular/core';
import { SpedizioneBoxServices } from '../../../core/services/spedizione-box-services';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { SpedizioneDetails } from '../../../dialogs/spedizione-details/spedizione-details';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-gestione-spedizione-box',
  imports: [MatListModule],
  templateUrl: './gestione-spedizione-box.html',
  styleUrl: './gestione-spedizione-box.css',
})
export class GestioneSpedizioneBox {
  private readonly SpedizioneBoxService = inject(SpedizioneBoxServices);
  private readonly util = inject(UtilitiesServices);
  readonly spedizioniBox = this.SpedizioneBoxService.spedizioniBox;
  ngOnInit(): void {
    this.SpedizioneBoxService.list();
  }

  onCreateSpedizione() {
  let dialogRef = this.util.openDialog(SpedizioneDetails,
      {
        mod: 'C',
        spedizione: null
      },
      {
        width: '1100px',
        maxWidth: '90vw',
        height: 'auto',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms'
      },
    )
  }
}
