import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SpedizioneServices } from '../../../core/services/spedizione-alcolico-services';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { SpedizioneDetails } from '../../../dialogs/spedizione-details/spedizione-details';
import { SpedizioneBoxServices } from '../../../core/services/spedizione-box-services';

type TipoSpedizione = 'ALCOLICO' | 'BOX';

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

  private readonly dialogConfig = {
    width: '1100px',
    maxWidth: '90vw',
    height: 'auto',
    enterAnimationDuration: '500ms',
    exitAnimationDuration: '500ms',
  };

  ngOnInit(): void {
    this.SpedizioneService.list();
    this.spedizioneBoxService.list();
  }

  onSelected(spedizione: any, tipo: TipoSpedizione) {
    this.mostraDettaglio(spedizione, tipo);
  }

  mostraDettaglio(spedizione: any, tipo: TipoSpedizione) {
    const dialogRef = this.util.openDialog(
      SpedizioneDetails,
      {
        mod: 'V',
        tipo,
        spedizione,
      },
      this.dialogConfig,
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.updated) {
        this.refreshList(tipo);
      }
    });
  }

  private refreshList(tipo: TipoSpedizione) {
    if (tipo === 'BOX') {
      this.spedizioneBoxService.list();
    } else {
      this.SpedizioneService.list();
    }
  }

  customerName(cliente: any): string {
    if (!cliente) return 'Cliente sconosciuto';
    const utente = cliente.utente;
    const nome = [utente?.nome, utente?.cognome].filter(Boolean).join(' ');
    return nome || utente?.email || `Cliente #${cliente.id}`;
  }

  cantinaName(cantina: any): string {
    if (!cantina) return '—';
    return cantina.nome ?? cantina.ragione_sociale ?? `Cantina #${cantina.id}`;
  }

  ordineLabel(ordine: any): string {
    if (!ordine) return '—';
    return `#${ordine.id}`;
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