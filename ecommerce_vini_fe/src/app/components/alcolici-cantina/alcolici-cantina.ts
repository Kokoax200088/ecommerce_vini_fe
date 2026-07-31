import { Component, computed, inject, Input } from '@angular/core';
import { CantinaALcolico } from '../../core/models/cantina';
import { CantinaServices } from '../../core/services/cantina-services';
import { CardAlcolico } from "../card-alcolico/card-alcolico";
import { QuantitaSelector } from "../quantita-selector/quantita-selector";
import { ProdottoAlcolico } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';
import { UtenteServices } from '../../core/services/utente-services';
import { AuthServices } from '../../core/services/auth-services';
import { switchMap } from 'rxjs';
import { NotificationServices } from '../../core/services/notification-services';

@Component({
  selector: 'app-alcolici-cantina',
  imports: [CardAlcolico, QuantitaSelector],
  templateUrl: './alcolici-cantina.html',
  styleUrl: './alcolici-cantina.css',
})
export class AlcoliciCantina {
  @Input() idCantina!: number;
  listCantinaALcolico: any;
  public readonly auth = inject(AuthServices);
  public readonly notificationS = inject(NotificationServices);

  
  loggedUtente = computed(() => this.utenteService.loggedUtente());

  constructor(private cantinaService: CantinaServices, private carrelloService: CarrelloService, private utenteService: UtenteServices) {
    this.listCantinaALcolico = this.cantinaService.alcolici;
  }

   ngOnInit(): void {
    this.cantinaService.listAlcolici(this.idCantina);
    const userId = this.auth.grant()?.userId ?? undefined;
    this.utenteService.findLoggedInfos(userId);
  }

  onAggiungiCarrello(alcolicoCantina: any, quantita: number): void {
  const idCarrello = this.loggedUtente()!.idCarrello;
  const idAlcolico = alcolicoCantina.alcolico.id;
  const idCantina = alcolicoCantina.idCantina;

  this.carrelloService.getByAlcolico(idAlcolico, idCarrello).pipe(
    switchMap((listaProdotti: ProdottoAlcolico[]) => {
      
      let operazioneCarrello$;

      if (listaProdotti && listaProdotti.length > 0) {
        const prodottoEsistente = listaProdotti[0];
        
        const quantitaAttuale = prodottoEsistente.quantità ?? prodottoEsistente['quantità'] ?? 0;
        const itemAggiornato: ProdottoAlcolico = {
          ...prodottoEsistente,
          quantità: quantitaAttuale + quantita
        };

        operazioneCarrello$ = this.carrelloService.updateProdottoAlcolico(itemAggiornato);

      } else {
        const body: Omit<ProdottoAlcolico, 'id'> = {
          id_carrello: idCarrello,
          id_alcolico: idAlcolico,
          id_cantina: idCantina,
          quantità: quantita
        };

        operazioneCarrello$ = this.carrelloService.createProdAlcolico(body);
      }

      return operazioneCarrello$.pipe(
        switchMap(() => this.cantinaService.updateCantinaAlcolico({
          id: alcolicoCantina.id,
          quantita: alcolicoCantina.quantita - quantita,
          cantinaId: idCantina,
          alcolicoId: idAlcolico
        }))
      );
    })
  ).subscribe({
    next: () => {
      this.cantinaService.listAlcolici(idCantina);
      this.notificationS.success("Articolo aggiunto al carrello");
    },
    error: (err) => console.error('Errore durante l\'aggiunta al carrello:', err)
  });
}
  

}
