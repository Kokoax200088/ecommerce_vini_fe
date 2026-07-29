import { Component, Input } from '@angular/core';
import { CantinaALcolico } from '../../core/models/cantina';
import { CantinaServices } from '../../core/services/cantina-services';
import { CardAlcolico } from "../card-alcolico/card-alcolico";
import { QuantitaSelector } from "../quantita-selector/quantita-selector";
import { ProdottoAlcolico } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';

@Component({
  selector: 'app-alcolici-cantina',
  imports: [CardAlcolico, QuantitaSelector],
  templateUrl: './alcolici-cantina.html',
  styleUrl: './alcolici-cantina.css',
})
export class AlcoliciCantina {
  @Input() idCantina!: number;
  listCantinaALcolico: any;

  constructor(private cantinaService: CantinaServices, private carrelloService: CarrelloService) {
    this.listCantinaALcolico = this.cantinaService.alcolici;
  }

   ngOnInit(): void {
    this.cantinaService.listAlcolici(this.idCantina);
  }

  onAggiungiCarrello(alcolicoCantina: any, quantita: number): void {
   const body: Omit<ProdottoAlcolico, 'id'> = {
    idCarrello: /* id del carrello corrente, es. da un CarrelloContext/AuthService */,
    idAlcolico: alcolicoCantina.alcolico.id,
    idCantina: alcolicoCantina.idCantina,
    quantita: quantita
  };

  this.carrelloService.createProdAlcolico(body).subscribe({
    next: (res) => console.log('Prodotto aggiunto al carrello', res),
    error: (err) => console.error('Errore aggiunta carrello', err)
  });
  console.log(`Aggiunti ${quantita} pezzi di ${alcolicoCantina.alcolico.nome}`);
}
  

}
