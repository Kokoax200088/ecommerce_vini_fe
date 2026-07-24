import { Component, inject, OnInit } from '@angular/core';
import { SpedizioneServices } from '../../core/services/spedizione-services';
import { UtilitiesServices } from '../../core/services/utilities-services';
import { SpedizioneDetails } from '../../dialogs/spedizione-details/spedizione-details';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-gestione-spedizione',
  imports: [MatListModule],
  templateUrl: './gestione-spedizione.html',
  styleUrl: './gestione-spedizione.css',
})
export class GestioneSpedizione implements OnInit{
  private readonly SpedizioneService = inject(SpedizioneServices);
  private readonly util = inject(UtilitiesServices);
  readonly spedizioni = this.SpedizioneService.spedizioni;
  ngOnInit(): void {
    this.SpedizioneService.list();
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
