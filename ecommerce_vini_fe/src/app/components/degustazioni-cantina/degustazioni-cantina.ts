import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CantinaDegustazione } from '../../core/models/cantina';
import { CantinaServices } from '../../core/services/cantina-services';
import { UtenteServices } from '../../core/services/utente-services';
import { AuthServices } from '../../core/services/auth-services';
import { ProdottoDegustazione } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';
import { TokenServices } from '../../core/security/token-services';
import { MeDTO } from '../../core/models/user';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-degustazioni-cantina',
  imports: [CommonModule],
  templateUrl: './degustazioni-cantina.html',
  styleUrl: './degustazioni-cantina.css',
})
export class DegustazioniCantina {
  @Input() idCantina!: number;
  @Input() isOwner: boolean = false;

  listCantinaDegustazioni: () => CantinaDegustazione[];

  public readonly auth = inject(AuthServices);
  private tokenService = inject(TokenServices);
  loggedUtente = computed(() => this.utenteService.loggedUtente());

  constructor(
    private cantinaService: CantinaServices,
    private carrelloService: CarrelloService,
    private utenteService: UtenteServices
  ) {
    this.listCantinaDegustazioni = this.cantinaService.degustazioni;
  }

  ngOnInit(): void {
    // 1. Carica le degustazioni (questo è pubblico e va bene per tutti)
    this.cantinaService.listDegustazioni(this.idCantina);

    // 2. Recuperiamo l'ID utente in modo sicuro, senza far arrabbiare TypeScript
    const grantData = this.auth.grant() as any;
    const userId = grantData?.userId || grantData?.id;

    // 3. CONTROLLO PREVENTIVO: Chiama il backend SOLO se c'è un utente loggato
    if (userId) {
      this.tokenService.me().subscribe({
        next: (resp: MeDTO) => {
          this.utenteService.findLoggedInfos(userId);
          console.log("nome=" + (this.loggedUtente()?.nome));
        },
        error: (resp: any) => {
          console.error("Errore in init profile: il token potrebbe essere scaduto", resp);
        }
      });
    } else {
      console.log("Utente non loggato: salto la chiamata /me per evitare l'errore 401 e il redirect automatico.");
    }
  }

  onAggiungiCarrello(degustazione: CantinaDegustazione, quantita: number = 1): void {
    const utente = this.loggedUtente();
    if (!utente) {
      console.error('Impossibile aggiungere al carrello: utente non ancora caricato o non loggato');
      return;
    }

    const idCarrello = utente.idCarrello;
    const idDegustazione = degustazione.id;
    const idCantina = this.idCantina;

    this.carrelloService.getByDegustazione(idDegustazione, idCarrello).pipe(
      switchMap((listaProdotti: any[]) => {

        if (listaProdotti && listaProdotti.length > 0) {
          const prodottoEsistente = listaProdotti[0];

          const quantitaAttuale = prodottoEsistente.quantità ?? 0;
          const itemAggiornato: ProdottoDegustazione = {
            id: prodottoEsistente.id,
            id_carrello: idCarrello,
            id_degustazione: idDegustazione,
            id_cantina: idCantina,
            quantità: quantitaAttuale + quantita
          };

          return this.carrelloService.updateProdottoDegustazione(itemAggiornato);
        }

        const body: Omit<ProdottoDegustazione, 'id'> = {
          id_carrello: idCarrello,
          id_degustazione: idDegustazione,
          id_cantina: idCantina,
          quantità: quantita
        };

        return this.carrelloService.createProdDegustazione(body);
      })
    ).subscribe({
      next: () => {
        console.log(`Degustazione "${degustazione.nome}" aggiunta al carrello`);
      },
      error: (err) => console.error('Errore durante l\'aggiunta al carrello:', err)
    });
  }
}