import { Component, inject, Input } from '@angular/core';
import { CardAlcolico } from "../card-alcolico/card-alcolico";
import { ProdottoAlcolico } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';

@Component({
  selector: 'app-prodotto-alcolico',
  imports: [CardAlcolico],
  templateUrl: './prodotto-alcolico.html',
  styleUrl: './prodotto-alcolico.css',
})
export class ProdottoAlcolicoComponent {
  @Input() listProdottoAlcolico!: ProdottoAlcolico[];

  private carrelloService = inject(CarrelloService);
  
  diminuisciQuantita(item: ProdottoAlcolico): void {
    const quantitaAttuale = item['quantità'] ?? item.quantità ?? 0;
    const nuovaQuantita = quantitaAttuale - 1;

    if (nuovaQuantita <= 0) {
      this.carrelloService.deleteProdottoAlcolico(item.id).subscribe({
        next: () => {
          this.listProdottoAlcolico = this.listProdottoAlcolico.filter(p => p.id !== item.id);
        },
        error: (err) => console.error('Errore durante l\'eliminazione:', err)
      });
    } else {
      const itemAggiornato = { ...item, quantità: nuovaQuantita };
      
      this.carrelloService.updateProdottoAlcolico(itemAggiornato).subscribe({
        next: () => {
          item['quantità'] = nuovaQuantita;
        },
        error: (err) => console.error('Errore durante l\'aggiornamento:', err)
      });
    }
  }

  aumentaQuantita(item: any): void {
    const quantitaAttuale = item['quantità'] ?? item.quantita ?? 0;
    const nuovaQuantita = quantitaAttuale + 1;
    const itemAggiornato = { ...item, quantità: nuovaQuantita };

    this.carrelloService.updateProdottoAlcolico(itemAggiornato).subscribe({
      next: () => {
        item['quantità'] = nuovaQuantita;
      },
      error: (err) => console.error('Errore durante l\'aggiornamento:', err)
    });
  }
}
