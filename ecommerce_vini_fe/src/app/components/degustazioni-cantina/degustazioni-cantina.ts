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
    this.cantinaService.listDegustazioni(this.idCantina);
    this.tokenService.me().subscribe({
      next: (resp: MeDTO) => {
        const userId = this.auth.grant().userId;
        if (userId) {
          this.utenteService.findLoggedInfos(userId);
          console.log("nome=" + (this.loggedUtente()?.nome));
        }
      },
      error: (resp: any) => {
        console.log("errore in init profile" + resp);
      }
    });
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