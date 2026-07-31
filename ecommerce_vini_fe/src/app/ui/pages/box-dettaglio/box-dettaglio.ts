import { Component, computed, inject, signal } from '@angular/core';
import { Box, BoxAlcolico } from '../../../core/models/box';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxServices } from '../../../core/services/box-services';
import { UploadImageService } from '../../../core/services/uploadImage';
import { BoxAlcolicoServices } from '../../../core/services/box-alcolico-services';
import { CantinaServices } from '../../../core/services/cantina-services';
import { Cantina, CantinaALcolico } from '../../../core/models/cantina';
import { AuthServices } from '../../../core/services/auth-services';
import { QuantitaSelector} from "../../../components/quantita-selector/quantita-selector";
import { BoxCantina } from '../../../components/box-cantina/box-cantina';
import { UtenteServices } from '../../../core/services/utente-services';
import { CarrelloService } from '../../../core/services/carrello-services';
import { switchMap } from 'rxjs';
import { ProdottoBox } from '../../../core/models/carrello';

@Component({
  selector: 'app-box-dettaglio',
  imports: [QuantitaSelector],
  templateUrl: './box-dettaglio.html',
  styleUrl: './box-dettaglio.css',
})
export class BoxDettaglio {
  id: number = -1;
  subtotal: number = 0;
  total: number = 0;
  maxBuyNumber: number = 0;
  listBoxAlcolico = signal<BoxAlcolico[]>([]);
  listBoxAlcolicoCantina = signal<CantinaALcolico[]>([]);
  box = signal<Box | undefined>(undefined);
  immagineUrl = signal<string>('/image-box.png');

  loggedUtente = computed(() => this.utenteService.loggedUtente());

  public readonly auth = inject(AuthServices);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boxService: BoxServices,
    private boxAlcolicoService: BoxAlcolicoServices,
    private cantinaService: CantinaServices,
    private carrelloService: CarrelloService,
    private utenteService: UtenteServices,
    private uploadImageBoxService: UploadImageService
  ){

  }

  ngOnInit(): void{
    this.id = Number(this.route.snapshot.paramMap.get('id')); //e funziona sta roba?
    console.log("ID set to " + this.id);

    this.boxService.getById(this.id).subscribe({
      next: (resp) => {
        this.box.set(resp);
        this.caricaImmagine();
        this.computeSubtotal();
        this.computeTotal();
        this.listBoxAlcolico.set(this.box()?.listBoxAlcolico ?? []);

        this.cantinaService.getCantinaAlcolicoByFilter(undefined, undefined).subscribe({
          next: (alcolicoCantinaList) => {
            const updated = this.listBoxAlcolico().map((boxAlc) => ({
              ...boxAlc,
              //available: this.boxAlcolicoService.findAvailability(boxAlc, alcolicoCantinaList),
              numberAvailable: this.boxAlcolicoService.findMaxNumber(boxAlc, alcolicoCantinaList)
            }));

            this.listBoxAlcolico.set(updated);
            this.computeMaxBuy();
          },
          error: (resp) => {
            console.error("Errore nel caricamento delle disponibilità alcoliche", resp);
          }
        });
      },
      error: (resp) => {
        console.error("Errore nel caricamento box", resp);
      }
    })
  }

  computeSubtotal(){
    const list = this.box()?.listBoxAlcolico;
    this.subtotal = 0; // dovrebbe essere già inizializzato ma per sicurezza lo metto
    list?.forEach((item) => {
      this.subtotal += item.alcolico.prezzo * item.quantita;
    })
  }

  computeTotal() {
    const scontoPercent = Number(this.box()?.sconto ?? 0);

    const discountAmount = (this.subtotal * scontoPercent) / 100;
    this.total = this.subtotal - discountAmount;
  }

  computeMaxBuy(){
    
    let min = 99; //numero max arbitrario di box acquistabili
    for (var item of this.listBoxAlcolico()) {
      if (item.numberAvailable < min) {
        console.log(item.alcolico.nome + " available:" + item.numberAvailable);
        min = item.numberAvailable;
      }
    }
    this.maxBuyNumber = Math.trunc(min);
    console.log("maxBuyNumber=" + this.maxBuyNumber);
  }

  caricaImmagine(){
    this.uploadImageBoxService.getById('box', this.id).subscribe({
      next: (immagine:any) => {
        this.immagineUrl.set(immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-box.png');
      },
      error: () => {
        this.immagineUrl.set('/image-box.png');
      }
    })
  }

  onImageError(event: Event) : void{
    console.log("onImageError Box id=" + this.id);
    const target = event.target as HTMLImageElement;
    target.src = '/image-box.png';
  }

  
  onAggiungiCarrello(boxCantina: any, quantita: number){
    //MA SCUSA se chiamassi il carrello di alcolici cantina più volte fin quando non finisco i vini del bundle?
    //TODO faccio dopo rip

    /*const loggedUtente = this.loggedUtente();
    const box = this.box();
    //come prendo la cantina?
    if (!loggedUtente || !box) {
      return;
    }

    const idCarrello = loggedUtente.idCarrello;
    const idBox = box.id;
    //CONST CANTINA HERE

    this.carrelloService.getByBox(idBox, idCarrello).pipe(
      switchMap((listaProdotti: ProdottoBox[]) => {
        let operazioneCarrello$;

        if (listaProdotti && listaProdotti.length > 0){
          const prodottoEsistente = listaProdotti[0];
          const quantitaAttuale = prodottoEsistente.quantità ?? prodottoEsistente['quantità'] ?? 0; //CHECK l'accento è red flag
          const itemAggiornato: ProdottoBox = {
            ...prodottoEsistente,
            quantità: quantitaAttuale + quantita
          };

          operazioneCarrello$ = this.carrelloService.updateProdottoBox(itemAggiornato);
        } else {
          const body: Omit<ProdottoBox, 'id'> = {
            id_carrello: idCarrello,
            id_box: idBox,
            //id_cantina serve?
            quantità: quantita
          };

          operazioneCarrello$ = this.carrelloService.createProdBox(body);

          return operazioneCarrello$.pipe(
            switchMap(( => this.cantinaService.updateCantinaAlcolico({
              id: 
            })))
          )
        }
      })
    )*/
  }
}
