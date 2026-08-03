import { ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { ProdottoAlcolicoComponent } from "../../../components/prodotto-alcolico/prodotto-alcolico";
import { ProdottoDegustazioneComponent } from '../../../components/prodotto-degustazione/prodotto-degustazione';
import { AuthServices } from '../../../core/services/auth-services';
import { CommonModule } from '@angular/common';
import { ProdottoBox } from "../../../components/prodotto-box/prodotto-box";

@Component({
  selector: 'app-carrello',
  imports: [ProdottoAlcolicoComponent, CommonModule, ProdottoDegustazioneComponent, ProdottoBox],
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
    const qtaBox = c.listaBox.reduce((acc, b) => acc + b.quantità, 0);

    return qtaAlcolici + qtaBox + qtaDegustazioni;
  });

  prezzoTotale = computed(() => {
    const c = this.cart();
    if (!c) return 0;

    const prezzoAlcolici = c.listaProdotti.reduce(
      (acc, p) => acc + (p.alcolico.prezzo * p.quantità), 0
    );

    console.log("AOO " + JSON.stringify(this.cart()?.listaBox));

    const prezzoBoxes = c.listaBox.reduce( //CHECK
      (acc, p) => acc + (p.box.prezzo * p.quantità), 0
    )

    const prezzoDegustazioni = this.computePrezzoBox();

    return prezzoAlcolici + prezzoBoxes + prezzoDegustazioni;
  });

  computePrezzoBox():number{
    console.log("entering computePrezzoBox");
    const list = this.cart()?.listaBox ?? [];
    //console.log("AOO " + JSON.stringify(list));
    let total = 0;
  
    if (!list) return 0;
    
  for (const box of list) {
    let boxSubtotal = 0;

    for (const item of box.listBoxAlcolico) {
      boxSubtotal += item.alcolico.prezzo * item.quantita;
    }

    const discountPercent = box.sconto as number;

    const boxTotal = boxSubtotal * (1 - discountPercent / 100);
    total += boxTotal;
  }

  console.log("AOO totale=" + total);
    return total;
  }

  procediOrdine() {}

}
