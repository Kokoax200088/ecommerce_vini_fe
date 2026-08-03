import { Component, computed, inject, Input, signal } from '@angular/core';
import { Box, BoxAlcolico } from '../../../core/models/box';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxServices } from '../../../core/services/box-services';
import { ImmagineModel, UploadImageService } from '../../../core/services/uploadImage';
import { BoxAlcolicoServices } from '../../../core/services/box-alcolico-services';
import { CantinaServices } from '../../../core/services/cantina-services';
import { Cantina, CantinaALcolico } from '../../../core/models/cantina';
import { AuthServices } from '../../../core/services/auth-services';
import { QuantitaSelector } from '../../../components/quantita-selector/quantita-selector';
import { BoxCantina } from '../../../components/box-cantina/box-cantina';
import { UtenteServices } from '../../../core/services/utente-services';
import { CarrelloService } from '../../../core/services/carrello-services';
import { concatMap, filter, forkJoin, from, of, switchMap, throwError } from 'rxjs';
import { ProdottoBox, ProdottoBoxRequest } from '../../../core/models/carrello';
import { Location, DecimalPipe } from '@angular/common';
import { BoxElimina } from '../../../components/box-elimina/box-elimina';
import { MatDialog } from '@angular/material/dialog';
import { NotificationServices } from '../../../core/services/notification-services';
import { DeleteBox } from '../../../dialogs/delete-box/delete-box';
import { UtilitiesServices } from '../../../core/services/utilities-services';
import { UploadImage } from '../../../components/upload-image/upload-image';

@Component({
  selector: 'app-box-dettaglio',
  imports: [QuantitaSelector, DecimalPipe],
  templateUrl: './box-dettaglio.html',
  styleUrl: './box-dettaglio.css',
})
export class BoxDettaglio {
  id: number = 99;
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
  private readonly dialog = inject(MatDialog);
  private readonly uploadImageService = inject(UploadImageService);
  private readonly util = inject(UtilitiesServices);
  private readonly notification = inject(NotificationServices);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private boxService: BoxServices,
    private boxAlcolicoService: BoxAlcolicoServices,
    private cantinaService: CantinaServices,
    private carrelloService: CarrelloService,
    private utenteService: UtenteServices,
    private uploadImageBoxService: UploadImageService,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); //e funziona sta roba?

    const userId = this.authService.grant()?.userId ?? undefined;
    this.utenteService.findLoggedInfos(userId);

    const qc = this.route.snapshot.queryParamMap.get('idCantina');
    this.idCantina.set(qc != null ? Number(qc) : undefined);
    console.log('ID set to ' + this.id + '. idCantina=' + this.idCantina);

    this.boxService.getById(this.id).subscribe({
      next: (resp) => {
        this.box.set(resp);
        this.caricaImmagine();
        this.computeSubtotal();
        this.computeTotal();
        this.listBoxAlcolico.set(this.box()?.listBoxAlcolico ?? []);

        this.cantinaService.getCantinaAlcolicoByFilter(null, null).subscribe({
          next: (alcolicoCantinaList) => {
            const updated = this.listBoxAlcolico().map((boxAlc) => ({
              ...boxAlc,
              //available: this.boxAlcolicoService.findAvailability(boxAlc, alcolicoCantinaList),
              numberAvailable: this.boxAlcolicoService.findMaxNumber(boxAlc, alcolicoCantinaList),
            }));

            this.listBoxAlcolico.set(updated);
            this.computeMaxBuy();
          },
          error: (resp) => {
            console.error('Errore nel caricamento delle disponibilità alcoliche', resp);
          },
        });
      },
      error: (resp) => {
        console.error('Errore nel caricamento box', resp);
      },
    });
  }

  computeSubtotal() {
    const list = this.box()?.listBoxAlcolico;
    this.subtotal = 0; // dovrebbe essere già inizializzato ma per sicurezza lo metto
    list?.forEach((item) => {
      this.subtotal += item.alcolico.prezzo * item.quantita;
    });
  }

  computeTotal() {
    const scontoPercent = Number(this.box()?.sconto ?? 0);

    const discountAmount = (this.subtotal * scontoPercent) / 100;
    this.total = this.subtotal - discountAmount;
  }

  computeMaxBuy() {
    let min = 99; //numero max arbitrario di box acquistabili
    for (var item of this.listBoxAlcolico()) {
      if (item.numberAvailable < min) {
        console.log(item.alcolico.nome + ' available:' + item.numberAvailable);
        min = item.numberAvailable;
        console.log('newMin=' + min);
      }
    }
    this.maxBuyNumber = Math.trunc(min);
    console.log('maxBuyNumber=' + this.maxBuyNumber);
  }

  caricaImmagine() {
    this.uploadImageBoxService.list<any>('box', 'idBox', this.id).subscribe({
       next: (immagini: any[]) => {
      const immagine = immagini?.[immagini.length - 1];
        this.immagineUrl.set(
          immagine?.url ?? immagine?.path ?? immagine?.nomeFile ?? '/image-box.png',
        );
      },
      error: () => {
        this.immagineUrl.set('/image-box.png');
      },
    });
  }

  onImageError(event: Event): void {
    console.log('onImageError Box id=' + this.id);
    const target = event.target as HTMLImageElement;
    target.src = '/image-box.png';
  }

  onAggiungiCarrello(boxCantina: Box, quantita: number) {
    console.log('onAggiungiCarrello box=' + boxCantina.nome + ' how many? ' + quantita);
    const user = this.loggedUtente();
    if (!user || !this.box) return;

    const idCarrello = user.idCarrello;
    const idBox = this.box()?.id;
    const idCantina = this.idCantina();
    console.log('idCarrello=' + idCarrello + ' idBox=' + idBox + ' idCantina=' + idCantina);

    if (idBox == null) {
      throw new Error('Box id mancante');
    }
    if (idCantina == null) {
      //è più safe di usare "!"
      return throwError(() => new Error('Id cantina mancante'));
    }

    // 1) Crea/aggiorna riga Box nel carrello (ProdottoBox)
    this.carrelloService
      .getByBox(idBox, idCarrello)
      .pipe(
        switchMap((listaProdotti: ProdottoBox[]) => {
          if (listaProdotti && listaProdotti.length > 0) {
            const rigaEsistente = listaProdotti[0];
            //console.log(JSON.stringify(listaProdotti[0]));
            const quantitaAttuale =
              rigaEsistente.quantità ?? (rigaEsistente as any)['quantità'] ?? 0;

            const bodyAggiornato: ProdottoBoxRequest = {
              id: listaProdotti[0].id,
              id_carrello: idCarrello,
              id_box: idBox,
              id_cantina: idCantina,
              quantità: quantitaAttuale + quantita,
            };
            /*const itemAggiornato: any = {
            ...rigaEsistente,
            quantita: quantitaAttuale + quantita,
          };*/

            return this.carrelloService.updateProdottoBox(bodyAggiornato);
          }

          const body: ProdottoBoxRequest = {
            id: 0,
            id_carrello: idCarrello,
            id_box: idBox, // richiesto dal backend
            id_cantina: idCantina,
            quantità: quantita,
          };

          console.log('PRODOTTOBOX BODY ' + JSON.stringify(body));
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
                  const nuovaQuantita: number = (item?.quantita ?? 0) - consumo;
                  //console.log("Item: " + JSON.stringify(item));
                  return this.cantinaService.updateCantinaAlcolico({
                    id: item.id, // IMPORTANTISSIMO: usa l'id della riga CantinaALcolico
                    cantinaId: item.idCantina,
                    alcolicoId: idAlcolico,
                    quantita: nuovaQuantita, // backend chiede la nuova quantità
                  });
                }),
              );
            }),
          );
        }),
      )
      .subscribe({
        next: () => {
          this.cantinaService.listAlcolici(idCantina);

          //CHECK con questa riga torno indietro alla pagina precedente, è preferibile? ci sono varie opzioni disponibili idk
          this.location.back();
        },
        error: (err) => console.error("Errore durante l'aggiunta del box al carrello:", err),
      });

    return null; //tutti i file path devono avere un return value
  }

  deleteBox(event: MouseEvent): void {
    console.log('deleteBox');

    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteBox, {
      //crea dialog
      width: '450px',
      data: {
        message: `Sei sicuro di voler rimuovere ${this.box()?.nome} da questa cantina?`,
        idCantina: this.idCantina(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((confermato) => confermato === true))
      .subscribe(() => this.eseguiDelete());
  }

  private eseguiDelete(): void {
  const boxId = this.box()?.id;
  if (!boxId) return;

  this.boxService.getById(boxId).pipe(
    switchMap((boxResp: Box | any) => {
      const list: BoxAlcolico[] = boxResp?.listBoxAlcolico ?? [];
      const deletes = list.map((ba) =>
        this.boxAlcolicoService.delete(ba.id)
      );

      // If there are no alcolici, still allow box deletion
      return deletes.length ? forkJoin(deletes) : from([null]);
    })
  ).subscribe({
    next: () => {
      this.boxService.delete(boxId).subscribe({
        next: () => {
          this.boxService.list();
          this.notification.success('Box rimosso dalla cantina');
        },
        error: (err) => {
          console.error('Errore durante la rimozione del box', err);
          this.notification.error('Impossibile rimuovere il box dalla cantina');
        }
      });
    },
    error: (err) => {
      console.error('Errore durante la cancellazione dei BoxAlcolico', err);
    }
  });
}

  addImage(event: MouseEvent): void {
    event.stopPropagation();
    
        this.uploadImageService.list<ImmagineModel>('alcolico', 'idAlcolico', this.id).subscribe({
          next: (immagini) => this.apriDialog(immagini ?? []),
          error: () => this.apriDialog([])
        });
  }

  private apriDialog(precedenti: ImmagineModel[]): void {
      const attuale = precedenti[precedenti.length - 1];
  
      const dialogRef = this.util.openDialog(UploadImage, {
        entity: 'box',
        idParamName: 'id_box',
        id: this.id,
        titolo: this.box()?.nome ?? "Immagine Box",
        imageUrl: attuale?.url ?? null
      });
  
      dialogRef.afterClosed().pipe(
        filter(salvata => salvata === true),
        switchMap(() => this.rimuoviPrecedenti(precedenti))
      ).subscribe({
        next: () => {
          this.notification.success('Immagine aggiornata');
        },
        error: (err) => {
          console.error('Errore durante l\'aggiornamento dell\'immagine', err);
          this.notification.error('Impossibile aggiornare l\'immagine dell\'alcolico');
        }
      });
    }

      private rimuoviPrecedenti(precedenti: ImmagineModel[]) {
        if (precedenti.length === 0) {
          return of([]);
        }
    
        return forkJoin(precedenti.map(immagine => this.uploadImageService.delete('alcolico', immagine.id)));
      }

}
