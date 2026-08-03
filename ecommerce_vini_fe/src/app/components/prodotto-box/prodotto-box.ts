import { Component, inject, Input, OnInit } from '@angular/core';
import { CardBox } from "../card-box/card-box";
import { CarrelloService } from '../../core/services/carrello-services';
import { CantinaServices } from '../../core/services/cantina-services';

@Component({
  selector: 'app-prodotto-box',
  imports: [CardBox],
  templateUrl: './prodotto-box.html',
  styleUrl: './prodotto-box.css',
})
export class ProdottoBox implements OnInit {
  @Input() listProdottoBox!: any[];
  @Input() idCart!: number;

  private carrelloService = inject(CarrelloService);
  private cantinaService = inject(CantinaServices);

  constructor(){

  }

  ngOnInit(){
  }

  rimuoviPezzo(item: any): void{
    console.debug("TODO funzione di rimuovi pezzo");
    const countAttuale = item['quantità'] ?? item.quantità ?? 0;
    const countNuova = countAttuale - 1;

    //const ripristinaStockCantina$ = this.cantinaService.getCantinaAlcolicoByFilter
  }
}
