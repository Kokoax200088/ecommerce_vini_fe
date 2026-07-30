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
  const body: Omit<ProdottoAlcolico, 'id'> = {
    id_carrello: this.loggedUtente()!.idCarrello,
    id_alcolico: alcolicoCantina.alcolico.id,
    id_cantina: alcolicoCantina.idCantina,
    quantità: quantita
  };

  this.carrelloService.createProdAlcolico(body).pipe(
    switchMap(() => this.cantinaService.updateCantinaAlcolico({
      id: alcolicoCantina.id,
      quantita: alcolicoCantina.quantita - quantita,
      cantinaId: body.id_cantina,
      alcolicoId: body.id_alcolico
    }))
  ).subscribe({
    next: () => {
      this.cantinaService.listAlcolici(body.id_cantina);
    },
    error: (err) => console.error('Errore aggiunta carrello', err)
  });
}
  

}
