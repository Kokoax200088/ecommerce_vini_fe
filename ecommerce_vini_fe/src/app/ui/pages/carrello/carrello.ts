import { ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { ProdottoAlcolicoComponent } from "../../../components/prodotto-alcolico/prodotto-alcolico";
import { ProdottoDegustazioneComponent } from '../../../components/prodotto-degustazione/prodotto-degustazione';
import { AuthServices } from '../../../core/services/auth-services';
import { CommonModule } from '@angular/common';
import { OrdiniServices } from '../../../core/services/ordini-services';
import { STATUS_ORDINE, STATUS_ORDINE_DEGUSTAZIONE } from '../../../core/models/status';
import { ordineDegustazioneReq } from '../../../core/models/ordineDegustazione';
import { OrdineDegustazioneServices } from '../../../core/services/ordine-degustazione-services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carrello',
  imports: [ProdottoAlcolicoComponent, CommonModule, ProdottoDegustazioneComponent],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  private cartService = inject(CarrelloService);
  private utenteService = inject(UtenteServices);
  private authService = inject(AuthServices);
  private ordineService = inject(OrdiniServices);
  private ordineDegustazioneService = inject(OrdineDegustazioneServices);
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


  procediOrdine() {
    const utente = this.utenteService.loggedUtente();
    const data_ordine = new Date().toISOString().slice(0, 10);
    const cart = this.cart();

    const ordine = {
      id_utente: utente?.id,
      id_status: STATUS_ORDINE.IN_ATTESA,
      data_ordine: data_ordine,
      totale: this.prezzoTotale(),
      indirizzoDestinazione: utente?.indirizzo,
      listOrdineAlcolico: cart?.listaProdotti.map(p => ({
        id_alcolico: p.alcolico.id,
        quantità: p.quantità
      })) ?? [],
      listOrdineDegustazione: [] 
    };

    this.ordineService.create(ordine).subscribe({
      next: (ordineCreato) => {
        const listaDegustazione = cart?.listaDegustazione ?? [];

        if (listaDegustazione.length === 0) {
          console.log('Ordine creato senza degustazioni:', ordineCreato);
          return;
        }

        const richiesteDegustazione = listaDegustazione.map(d => {
          const body: ordineDegustazioneReq = {
            ordineId: ordineCreato.id,
            statusId: STATUS_ORDINE_DEGUSTAZIONE.IN_ATTESA,
            degustazioneId: d.degustazione.id,
            cantinaId: d.degustazione.id_cantina,
            quantita: d.quantità,
            data_ordine: data_ordine
          };
          return this.ordineDegustazioneService.create(body);
        });

        forkJoin(richiesteDegustazione).subscribe({
          next: () => console.log('Tutte le degustazioni associate all\'ordine', ordineCreato.id + " JSON ordine creato:" + JSON.stringify(ordineCreato)),
          error: (err) => console.error('Errore nella creazione di una o più ordine-degustazione', err)
        });
      },
      error: (err) => console.error('Errore nella creazione dell\'ordine', err)
    });
  }

  
}
