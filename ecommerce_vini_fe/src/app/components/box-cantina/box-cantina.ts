import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BoxServices } from '../../core/services/box-services';
import { QuantitaSelector } from "../quantita-selector/quantita-selector";
import { CardBox } from "../card-box/card-box";
import { Box } from '../../core/models/box';
import { Observable } from 'rxjs';
import { AuthServices } from '../../core/services/auth-services';
import { CarrelloService } from '../../core/services/carrello-services';
import { UtenteServices } from '../../core/services/utente-services';
import { BoxElimina } from "../box-elimina/box-elimina";
import { CardAddBox } from "../card-add-box/card-add-box";

@Component({
  selector: 'app-box-cantina',
  imports: [CardBox, AsyncPipe, BoxElimina, CardAddBox],
  templateUrl: './box-cantina.html',
  styleUrl: './box-cantina.css',
})
export class BoxCantina {
  @Input() idCantina!:number;
  listBoxCantina!: Observable<Box[]>;
  public readonly auth = inject(AuthServices);

  loggedUtente = computed(() => this.utenteService.loggedUtente());

  constructor(private boxService:BoxServices, private carrelloService: CarrelloService, private utenteService: UtenteServices){
    //this.listBoxCantina = this.boxService.listByIdCantina(this.idCantina);
  }

  ngOnInit(): void{
    //qui dovrei inizializzare la lista dei box in base all'id cantina
    this.listBoxCantina =  this.boxService.listByIdCantina(this.idCantina); //ma serve farlo again?
    const userId = this.auth.grant()?.userId ?? undefined;
    this.utenteService.findLoggedInfos(userId);
  }
}
