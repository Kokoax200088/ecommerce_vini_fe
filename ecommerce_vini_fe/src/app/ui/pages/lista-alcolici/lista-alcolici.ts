import { Component } from '@angular/core';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { CardAlcolico } from "../../../components/card-alcolico/card-alcolico";
import { SearchBar } from "../../../components/search-bar/search-bar";

@Component({
  selector: 'app-lista-alcolici',
  imports: [CardAlcolico, SearchBar],
  templateUrl: './lista-alcolici.html',
  styleUrl: './lista-alcolici.css',
})
export class ListaAlcolici {
  alcolici : any;

  constructor(private alcolicoService: AlcolicoServices){
    this.alcolici = this.alcolicoService.alcolici;
  }

   ngOnInit(): void {
    this.alcolicoService.list();
  }

  onSearch(query: string): void {
    this.alcolicoService.list(undefined, undefined, query);
  }
}
