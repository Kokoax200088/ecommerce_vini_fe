import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdottoDegustazione } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';
import { CardDegustazione } from "../card-degustazione/card-degustazione";

@Component({
  selector: 'app-prodotto-degustazione',
  imports: [CommonModule, CardDegustazione],
  templateUrl: './prodotto-degustazione.html',
  styleUrl: './prodotto-degustazione.css',
})
export class ProdottoDegustazioneComponent {
  @Input() listProdottoDegustazione!: any[];
  @Input() idCart!: number;

  private carrelloService = inject(CarrelloService);

  diminuisciQuantita(item: any): void {
    const quantitaAttuale = item['quantità'] ?? item.quantità ?? 0;
    const nuovaQuantita = quantitaAttuale - 1;

    if (nuovaQuantita <= 0) {
      this.carrelloService.deleteProdottoDegustazione(item.id).subscribe({
        next: () => {
          this.listProdottoDegustazione = this.listProdottoDegustazione.filter(p => p.id !== item.id);
          this.carrelloService.getCartById(this.idCart).subscribe();
        },
        error: (err) => console.error('Errore durante l\'eliminazione:', err)
      });

    } else {
      const itemAggiornato = {
        id: item.id,
        id_carrello: 0,
        id_degustazione: 0,
        id_cantina: 0,
        quantità: nuovaQuantita,
      };
      this.carrelloService.updateProdottoDegustazione(itemAggiornato).subscribe({
        next: () => {
          item['quantità'] = nuovaQuantita;
          this.carrelloService.getCartById(this.idCart).subscribe();
        },
        error: (err) => console.error('Errore durante l\'aggiornamento:', err)
      });
    }
  }
}