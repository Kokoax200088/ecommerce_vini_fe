import { Component, computed, inject, Input, signal } from '@angular/core';
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
import { concatMap, from, switchMap, throwError } from 'rxjs';
import { ProdottoBox, ProdottoBoxRequest } from '../../../core/models/carrello';

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
  idCantina = signal<number | undefined>(undefined);
  box = signal<Box | undefined>(undefined);
  immagineUrl = signal<string>('/image-box.png');

  loggedUtente = computed(() => this.utenteService.loggedUtente());

  public readonly authService = inject(AuthServices);

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

    const userId = this.authService.grant()?.userId ?? undefined;
    this.utenteService.findLoggedInfos(userId);


    const qc = this.route.snapshot.queryParamMap.get('idCantina');
    this.idCantina.set(qc != null ? Number(qc) : undefined);
    console.log("ID set to " + this.id + ". idCantina=" + this.idCantina);

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

  
  onAggiungiCarrello(boxCantina: Box, quantita: number){
    console.log("onAggiungiCarrello box=" + boxCantina.nome + " how many? " + quantita);
    const user = this.loggedUtente();
    if (!user || !this.box) return;

    const idCarrello = user.idCarrello;
    const idBox = this.box()?.id;
    const idCantina = this.idCantina();
    console.log("idCarrello=" + idCarrello + " idBox=" + idBox + " idCantina=" + idCantina);

    if (idBox == null) {
      throw new Error('Box id mancante');
    }
    if (idCantina == null) { //è più safe di usare "!"
      return throwError(() => new Error('Id cantina mancante'));
    }

    // 1) Crea/aggiorna riga Box nel carrello (ProdottoBox)
    this.carrelloService.getByBox(idBox, idCarrello).pipe(
      switchMap((listaProdotti: ProdottoBox[]) => {
        if (listaProdotti && listaProdotti.length > 0) {
          const rigaEsistente = listaProdotti[0];
          //console.log(JSON.stringify(listaProdotti[0]));
          const quantitaAttuale =
            rigaEsistente.quantità ?? (rigaEsistente as any)['quantità'] ?? 0;

          const bodyAggiornato: ProdottoBoxRequest ={
            id: listaProdotti[0].id,
            id_carrello:idCarrello,
            id_box: idBox,
            id_cantina: idCantina,
            quantità: quantitaAttuale + quantita
          }
          /*const itemAggiornato: any = {
            ...rigaEsistente,
            quantita: quantitaAttuale + quantita,
          };*/

          return this.carrelloService.updateProdottoBox(bodyAggiornato);
        }

        const body:ProdottoBoxRequest = {
          id: 0,
          id_carrello: idCarrello,
          id_box: idBox, // richiesto dal backend
          id_cantina: idCantina,
          quantità: quantita,
        };

        console.log("PRODOTTOBOX BODY " + JSON.stringify(body));
        return this.carrelloService.createProdBox(body);
      }),

      // 2) Decrementa cantina per ogni componente del box
          switchMap(() => {
            const boxValue = this.box();
            if (!boxValue?.listBoxAlcolico?.length) {
              return from([] as any[]); //se non lo metto vs code mi flamma 
            }
            return from(boxValue.listBoxAlcolico).pipe(
              concatMap((comp) => {
                const idAlcolico = comp.alcolico.id;
                const consumo = comp.quantita * quantita; // per 1 box: comp.quantita, per quantitaBox: *
              
                // Leggi quantità attuale in cantina
                return this.cantinaService.getCantinaAlcolicoByFilter(idCantina, idAlcolico).pipe(
                  switchMap((rigaCantina: any) => {
                    const item = Array.isArray(rigaCantina) ? rigaCantina[0] : rigaCantina;
                    const nuovaQuantita :number = (item?.quantita ?? 0) - consumo;
                    //console.log("Item: " + JSON.stringify(item));
                    return this.cantinaService.updateCantinaAlcolico({
                      id: item.id,     // IMPORTANTISSIMO: usa l'id della riga CantinaALcolico
                      cantinaId: item.idCantina,
                      alcolicoId: idAlcolico,
                      quantita: nuovaQuantita, // backend chiede la nuova quantità
                    });
                  })
                );
              })
            );
          })
        ).subscribe({
          next: () => {
            this.cantinaService.listAlcolici(idCantina);
            //this.router.navigate(['/box'], this.id);
          },
          error: (err) => console.error('Errore durante l\'aggiunta del box al carrello:', err),
        });

        return null; //tutti i file path devono avere un return value
      }

}
