import { Component, inject, OnInit } from '@angular/core';
import { OrdiniServices } from '../../../core/services/ordini-services';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdineDetails } from '../../../dialogs/ordine-details/ordine-details';
import { UtilitiesServices } from '../../../core/services/utilities-services';

@Component({
  selector: 'app-gestione-ordine',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './gestione-ordine.html',
  styleUrl: './gestione-ordine.css',
})
export class GestioneOrdine implements OnInit {
  private readonly ordiniService = inject(OrdiniServices);
  private readonly util = inject(UtilitiesServices);
  readonly ordini = this.ordiniService.ordini;

  ngOnInit(): void {
    this.ordiniService.list();
  }

  onSelected(ordine: any) {
    this.mostraDettaglio(ordine);
  }

  mostraDettaglio(ordine: any) {
    let dialogRef = this.util.openDialog(OrdineDetails,
      {
        ordine: ordine
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

  
  customerName(utente: any): string {
    if (!utente) return 'Cliente sconosciuto';
    const nome = [utente.nome, utente.cognome].filter(Boolean).join(' ');
    return nome || utente.email || `Utente #${utente.id}`;
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