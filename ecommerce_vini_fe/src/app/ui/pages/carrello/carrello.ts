import { ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { ProdottoAlcolicoComponent } from "../../../components/prodotto-alcolico/prodotto-alcolico";
import { AuthServices } from '../../../core/services/auth-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrello',
  imports: [ProdottoAlcolicoComponent, CommonModule],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  private cartService = inject(CarrelloService);
  private utenteService = inject(UtenteServices);
  private authService = inject(AuthServices);

  loggedUtente = computed(() => this.utenteService.loggedUtente());
  cart = this.cartService.cart;

 constructor() {
  effect(() => {
    const utente = this.utenteService.loggedUtente();
    if (utente?.idCarrello) {
      this.cartService.getCartById(utente.idCarrello).subscribe();
    }
  });
}

ngOnInit(): void {
  const userId = this.authService.grant()?.userId ?? undefined;
  this.utenteService.findLoggedInfos(userId);
}

  quantitaTotale = computed(() => {
    const c = this.cart();
    if (!c) return 0;

    const qtaAlcolici = c.listaProdotti.reduce((acc, p) => acc + p.quantità, 0);
    const qtaDegustazioni = c.listaDegustazione.reduce((acc, d) => acc + d.quantità, 0);
    const qtaBox = c.listaDegustazione.reduce((acc, b) => acc + b.quantità, 0);

    return qtaAlcolici + qtaDegustazioni;
  });

  prezzoTotale = computed(() => {
    const c = this.cart();
    if (!c) return 0;

    const prezzoAlcolici = c.listaProdotti.reduce(
      (acc, p) => acc + (p.alcolico.prezzo * p.quantità), 0
    );
    const prezzoDegustazioni = c.listaDegustazione.reduce(
      (acc, d) => acc + (d.degustazione.prezzo * d.quantità), 0
    );

    return prezzoAlcolici + prezzoDegustazioni;
  });


  procediOrdine() {}

}
