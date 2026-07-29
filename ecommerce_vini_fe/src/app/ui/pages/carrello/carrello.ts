import { Component, computed } from '@angular/core';
import { CarrelloModel } from '../../../core/models/carrello';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-carrello',
  imports: [],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  cart?: CarrelloModel;
  loggedUtente = computed(() => this.utenteService.loggedUtente());
  constructor(private cartService: CarrelloService, private utenteService: UtenteServices) {}

  quantitaTotale = computed(() => {
    if(this.cart != null) {
    const c = this.cart;
    if (!c) return 0;

    const qtaAlcolici = c.listaProdotti.reduce((acc, p) => acc + p.quantita, 0);
    const qtaDegustazioni = c.listaDegustazione.reduce((acc, d) => acc + d.quantita, 0);

    return qtaAlcolici + qtaDegustazioni;
    }
    return 0;
  });

  prezzoTotale = computed(() => {
    if(this.cart != null) {
    const c = this.cart;
    if (!c) return 0;

    const prezzoAlcolici = c.listaProdotti.reduce(
      (acc, p) => acc + (p.alcolico.prezzo * p.quantita), 0
    );
    const prezzoDegustazioni = c.listaDegustazione.reduce(
      (acc, d) => acc + (d.degustazione.prezzo * d.quantita), 0
    );

    return prezzoAlcolici + prezzoDegustazioni;
  }
  return 0;
  });

   ngOnInit(): void {
    this.cartService.getCartById(this.loggedUtente()!.idCarrello).subscribe({
      next: (resp) => {
        this.cart = resp;
      },
      error: (err) => {
        console.error('Errore nel caricamento carrello', err);
      }
    });
    
  }

}
