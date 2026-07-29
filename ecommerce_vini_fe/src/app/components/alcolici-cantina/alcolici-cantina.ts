import { Component, computed, inject, Input } from '@angular/core';
import { CantinaALcolico } from '../../core/models/cantina';
import { CantinaServices } from '../../core/services/cantina-services';
import { CardAlcolico } from "../card-alcolico/card-alcolico";
import { QuantitaSelector } from "../quantita-selector/quantita-selector";
import { ProdottoAlcolico } from '../../core/models/carrello';
import { CarrelloService } from '../../core/services/carrello-services';
import { UtenteServices } from '../../core/services/utente-services';
import { AuthServices } from '../../core/services/auth-services';

@Component({
  selector: 'app-alcolici-cantina',
  imports: [CardAlcolico, QuantitaSelector],
  templateUrl: './alcolici-cantina.html',
  styleUrl: './alcolici-cantina.css',
})
export class AlcoliciCantina {
  @Input() idCantina!: number;
  listCantinaALcolico: any;
  loggedUtente = computed(() => this.utenteService.loggedUtente());
  public readonly auth = inject(AuthServices);

  constructor(private cantinaService: CantinaServices, private carrelloService: CarrelloService, private utenteService: UtenteServices) {
    this.listCantinaALcolico = this.cantinaService.alcolici;
  }

   ngOnInit(): void {
    this.cantinaService.listAlcolici(this.idCantina);
  }

  onAggiungiCarrello(alcolicoCantina: any, quantita: number): void {
   const body: Omit<ProdottoAlcolico, 'id'> = {
    idCarrello: this.loggedUtente()!.idCarrello,
    alcolico: alcolicoCantina.alcolico,
    idCantina: alcolicoCantina.idCantina,
    quantita: quantita
  };

 this.carrelloService.createProdAlcolico(body).subscribe({
    next: () => {
      // aggiorna il signal in locale, senza rifare una fetch completa
      this.cantinaService.alcolici.update(lista =>
      lista.map(item =>
        item.id === alcolicoCantina.id
          ? { ...item, quantita: item.quantita - quantita }
          : item
      )
    );

    // 2. persisti la modifica sul backend (se serve, vedi nota sotto)
    this.cantinaService.updateCantinaAlcolico({
      id: alcolicoCantina.id,
      quantita: alcolicoCantina.quantita - quantita
    }).subscribe();
  },
  error: (err) => console.error('Errore aggiunta carrello', err)
  });
  console.log(`Aggiunti ${quantita} pezzi di ${alcolicoCantina.alcolico.nome}`);
}
  

}
