import { Component, inject } from '@angular/core';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { AuthServices } from '../../../core/services/auth-services';
import { CardAlcolico } from "../../../components/card-alcolico/card-alcolico";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { AlcolicoElimina } from "../../../components/alcolico-elimina/alcolico-elimina";
import { AlcolicoImmagine } from "../../../components/alcolico-immagine/alcolico-immagine";

@Component({
  selector: 'app-lista-alcolici',
  imports: [CardAlcolico, SearchBar, AlcolicoElimina, AlcolicoImmagine],
  templateUrl: './lista-alcolici.html',
  styleUrl: './lista-alcolici.css',
})
export class ListaAlcolici {
  alcolici : any;

  public readonly auth = inject(AuthServices);

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
