import { Component } from '@angular/core';
import { CantinaServices } from '../../../core/services/cantina-services';
import { CardCantina } from "../../../components/card-cantina/card-cantina";
import { SearchBar } from "../../../components/search-bar/search-bar";

@Component({
  selector: 'app-catalogo-cantine',
  imports: [CardCantina, SearchBar],
  templateUrl: './catalogo-cantine.html',
  styleUrl: './catalogo-cantine.css',
})
export class CatalogoCantine {
  cantine : any;

  constructor(private cantinaService: CantinaServices){
    this.cantine = this.cantinaService.cantine;
  }

   ngOnInit(): void { 
    this.cantinaService.list();
  }

  onSearch(query: string): void {
  this.cantinaService.list(query);
}
}
