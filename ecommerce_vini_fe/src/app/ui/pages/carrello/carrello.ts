import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { CarrelloModel } from '../../../core/models/carrello';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { ProdottoAlcolicoComponent } from "../../../components/prodotto-alcolico/prodotto-alcolico";

@Component({
  selector: 'app-carrello',
  imports: [ProdottoAlcolicoComponent],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  cart?: CarrelloModel;
  private cdr = inject(ChangeDetectorRef); // capire se si può usare anche in sto caso
  constructor(private cartService: CarrelloService, private utenteService: UtenteServices) {}

  quantitaTotale = computed(() => {
    if(this.cart != null) {
    const c = this.cart;
    if (!c) return 0;

    const qtaAlcolici = c.listaProdotti.reduce((acc, p) => acc + p.quantità, 0);
    const qtaDegustazioni = c.listaDegustazione.reduce((acc, d) => acc + d.quantità, 0);

    return qtaAlcolici + qtaDegustazioni;
    }
    return 0;
  });

  prezzoTotale = computed(() => {
    if(this.cart != null) {
    const c = this.cart;
    if (!c) return 0;

    const prezzoAlcolici = c.listaProdotti.reduce(
      (acc, p) => acc + (p.alcolico.prezzo * p.quantità), 0
    );
    const prezzoDegustazioni = c.listaDegustazione.reduce(
      (acc, d) => acc + (d.degustazione.prezzo * d.quantità), 0
    );

    return prezzoAlcolici + prezzoDegustazioni;
  }
  return 0;
  });

   ngOnInit(): void {
    this.cartService.getCartById(4).subscribe({
      next: (resp) => {
        this.cart = resp;
      },
      error: (err) => {
        console.error('Errore nel caricamento carrello', err);
      }
    });
    
  }

  procediOrdine() {}

}
