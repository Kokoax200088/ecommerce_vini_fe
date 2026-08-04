import { Component, inject, OnInit, SimpleChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SpedizioneServices } from '../../../core/services/spedizione-alcolico-services';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { SpedizioneDetails } from '../../../dialogs/spedizione-details/spedizione-details';
import { SpedizioneBoxServices } from '../../../core/services/spedizione-box-services';

@Component({
  selector: 'app-gestione-spedizione',
  imports: [AsyncPipe],
  templateUrl: './gestione-spedizione.html',
  styleUrl: './gestione-spedizione.css',
})
export class GestioneSpedizione implements OnInit {
  private readonly SpedizioneService = inject(SpedizioneServices);
  private readonly spedizioneBoxService = inject(SpedizioneBoxServices);
  private readonly util = inject(UtilitiesServices);
  readonly spedizioni = this.SpedizioneService.spedizioni;
  readonly spedizioniBox = this.spedizioneBoxService.spedizioniBox;


  ngOnInit(): void {
    this.SpedizioneService.list();
    this.spedizioneBoxService.list();
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

  onSelected(spedizione: any) {
    this.mostraDettaglio(spedizione);
  }

  mostraDettaglio(spedizione: any) {
    let dialogRef = this.util.openDialog(SpedizioneDetails,
      {
        mod: 'V',
        spedizione: spedizione
      },
      {
        width: '1100px',
        maxWidth: '90vw',
        height: 'auto',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms'
      },
    )

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.updated) {
        this.SpedizioneService.list();
      }
    });
  }

  customerName(cliente: any): string {
    if (!cliente) return 'Cliente sconosciuto';
    const nome = [cliente.nome, cliente.cognome].filter(Boolean).join(' ');
    return nome || cliente.email || `Utente #${cliente.id}`;
  }

  cantinaName(cantina: any): string {
    if (!cantina) return '—';
    return cantina.nome ?? cantina.ragione_sociale ?? `Cantina #${cantina.id}`;
  }

  ordineLabel(ordineAlcolico: any): string {
    if (!ordineAlcolico) return '—';
    return `#${ordineAlcolico.id}`;
  }

  statusSlug(status: any): string {
    if (!status?.nome) return 'default';
    return status.nome
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  }
}