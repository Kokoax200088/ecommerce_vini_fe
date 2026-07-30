import { Component, inject, Input } from '@angular/core';
import { CardAlcolico } from "../card-alcolico/card-alcolico";
import { ProdottoAlcolico } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';
import { CantinaServices } from '../../core/services/cantina-services';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-prodotto-alcolico',
  imports: [CardAlcolico],
  templateUrl: './prodotto-alcolico.html',
  styleUrl: './prodotto-alcolico.css',
})
export class ProdottoAlcolicoComponent {
  @Input() listProdottoAlcolico!: any[];
  @Input() idCart!: number;

  private carrelloService = inject(CarrelloService);
  private cantinaService = inject(CantinaServices);
  
  diminuisciQuantita(item: any): void {
    const quantitaAttuale = item['quantità'] ?? item.quantità ?? 0;
    const nuovaQuantita = quantitaAttuale - 1;

    const ripristinaStockCantina$ = this.cantinaService
      .getCantinaAlcolicoByFilter(item.cantina.id, item.alcolico.id)
      .pipe(
        switchMap(risultati => {
          const cantinaAlcolico = risultati[0];
          return this.cantinaService.updateCantinaAlcolico({
            id: cantinaAlcolico.id,
      quantita: cantinaAlcolico.quantita + 1,
      cantinaId: cantinaAlcolico.idCantina,
      alcolicoId: cantinaAlcolico.alcolico.id,
          });
        })
      );

    if (nuovaQuantita <= 0) {
      this.carrelloService.deleteProdottoAlcolico(item.id).pipe(
        switchMap(() => ripristinaStockCantina$)
      ).subscribe({
        next: () => {
          this.listProdottoAlcolico = this.listProdottoAlcolico.filter(p => p.id !== item.id);
          this.carrelloService.getCartById(this.idCart).subscribe();
        },
        error: (err) => console.error('Errore durante l\'eliminazione o aggiornamento stock:', err)
      });

    } else {
      const itemAggiornato = { ...item, quantità: nuovaQuantita };
      
      // 1. Aggiorna quantità carrello -> 2. Incrementa stock cantina
      this.carrelloService.updateProdottoAlcolico(itemAggiornato).pipe(
        switchMap(() => ripristinaStockCantina$)
      ).subscribe({
        next: () => {
          item['quantità'] = nuovaQuantita;
          this.carrelloService.getCartById(this.idCart).subscribe();
        },
        error: (err) => console.error('Errore durante l\'aggiornamento:', err)
      });
    }
  }
}