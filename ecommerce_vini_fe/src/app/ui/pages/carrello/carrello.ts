import { ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { CarrelloService } from '../../../core/services/carrello-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { ProdottoAlcolicoComponent } from "../../../components/prodotto-alcolico/prodotto-alcolico";
import { ProdottoDegustazioneComponent } from '../../../components/prodotto-degustazione/prodotto-degustazione';
import { AuthServices } from '../../../core/services/auth-services';
import { CommonModule } from '@angular/common';
import { ProdottoBox } from "../../../components/prodotto-box/prodotto-box";
import { OrdiniServices } from '../../../core/services/ordini-services';
import { STATUS_ORDINE, STATUS_ORDINE_DEGUSTAZIONE } from '../../../core/models/status';
import { ordineDegustazioneReq } from '../../../core/models/ordineDegustazione';
import { OrdineDegustazioneServices } from '../../../core/services/ordine-degustazione-services';
import { forkJoin, of } from 'rxjs';
import { OrdineAlcolicoService } from '../../../core/services/ordine-alcolico-services';
import { ordineAlcolicoReq } from '../../../core/models/ordineAlcolico';
import { ordineBoxReq } from '../../../core/models/ordineBox';
import { OrdineBoxServices } from '../../../core/services/ordine-box-service';

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
  private ordineService = inject(OrdiniServices);
  private ordineDegustazioneService = inject(OrdineDegustazioneServices);
  private ordineAlcolicoService = inject(OrdineAlcolicoService);
  private ordineBoxService = inject(OrdineBoxServices);
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

    return qtaAlcolici + qtaDegustazioni + qtaBox;
  });

 prezzoTotale = computed(() => {
    const c = this.cart();
    if (!c) return 0;

    const prezzoAlcolici = c.listaProdotti.reduce(
      (acc, p) => acc + (p.alcolico.prezzo * p.quantità), 0
    );

    const prezzoBoxes = (c.listaBox ?? []).reduce((acc, p) => {
    const box = p.box;

    // somma prezzi dei prodotti contenuti nella box
    const prezzoBoxSenzaSconto = (box.listBoxAlcolico ?? []).reduce((acc2:number, item:{ alcolico?: { prezzo?: number }; quantita?: number }) => {
      const prezzoSingolo = item.alcolico?.prezzo ?? 0;
      const qtaItem = item.quantita ?? 0;
      return acc2 + prezzoSingolo * qtaItem;
    }, 0);

    // sconto: se è in % (es. sconto=15 significa -15%)
    const scontoPercent = box.sconto ?? 0;
    const prezzoBoxConSconto = prezzoBoxSenzaSconto * (1 - scontoPercent / 100);

    // p.quantità = numero di box nel carrello
    return acc + prezzoBoxConSconto * (p.quantità ?? 0);
  }, 0);

    const prezzoDegustazioni = c.listaDegustazione.reduce(
      (acc, d) => acc + (d.degustazione.prezzo * d.quantità), 0
    );

    return prezzoAlcolici + prezzoBoxes + prezzoDegustazioni;
  });

  computePrezzoBox(): number {
    const list = this.cart()?.listaBox ?? [];
    return list.reduce(
      (acc, p) => acc + (p.box.prezzo * p.quantità),
      0
    );
  }

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
        const listaProdotti = cart?.listaProdotti ?? [];
        const listaBox = cart?.listaBox ?? [];
        if (listaDegustazione.length === 0) {
          console.log('Ordine creato senza degustazioni:', ordineCreato);
        }
        console.log('ID ordine creato:', ordineCreato.id);
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

        const richiestaAlcolico = listaProdotti.map(p => {
          const body: ordineAlcolicoReq = {
            ordineId: ordineCreato.id,
            alcolicoId: p.alcolico.id,
            quantita: p.quantità,
            cantinaId: p.cantina.id,
            statusId: STATUS_ORDINE.IN_ATTESA,
            data_ordine: data_ordine
          };
          return this.ordineAlcolicoService.create(body);
        });
        const richiestaBox = listaBox.map(b =>{ 
            const body: ordineBoxReq = {
              data_ordine: data_ordine,
              ordineId: ordineCreato.id,
              boxId: b.box.id, 
              statusId: STATUS_ORDINE.IN_ATTESA,
              cantinaId: b.cantina.id, 
              quantita: b.quantità     
            };
          return this.ordineBoxService.create(body);
        });
        forkJoin(richiesteDegustazione).subscribe({
          next: () => console.log('Tutte le degustazioni associate all\'ordine', ordineCreato.id + " JSON ordine creato:" + JSON.stringify(ordineCreato)),
          error: (err) => console.error('Errore nella creazione di una o più ordine-degustazione', err)
        });

        forkJoin(richiestaAlcolico).subscribe({
          next: () => console.log('Tutti gli alcolici associati all\'ordine', ordineCreato.id + " JSON ordine creato:" + JSON.stringify(ordineCreato)),
          error: (err) => console.error('Errore nella creazione di una o più ordine-alcolico', err)
        });

        forkJoin(richiestaBox).subscribe({
          next: () => console.log('Tutti i box associati all\'ordine', ordineCreato.id + " JSON ordine creato:" + JSON.stringify(ordineCreato)),
          error: (err) => console.error('Errore nella creazione di una o più ordine-box', err)
        });

        forkJoin([
          forkJoin(richiesteDegustazione.length ? richiesteDegustazione : [of(null)]),
          forkJoin(richiestaAlcolico.length ? richiestaAlcolico : [of(null)]),
          forkJoin(richiestaBox.length ? richiestaBox : [of(null)])
        ]).subscribe({
          next: () => {
            const idCarrello = utente?.idCarrello;
            if (idCarrello) {
              this.cartService.svuotaCarrello(idCarrello).subscribe({
                next: () => console.log('Carrello svuotato con successo'),
                error: (err) => console.error('Errore nello svuotamento del carrello', err)
              });
            } else {
              this.cartService.clearCartState();
            }
          },
          error: (err) => console.error('Errore: carrello non svuotato per un errore nella creazione dell\'ordine', err)
        });
      },
      error: (err) => console.error('Errore nella creazione dell\'ordine', err)
    });
  }

  
}
