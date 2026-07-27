import { Component } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { TableColumn, TableGeneric } from '../../../components/table-column/table-column';
import { MatIcon } from "@angular/material/icon";
import { SearchBar } from "../../../components/search-bar/search-bar";

@Component({
  selector: 'app-gestione-venditori',
  imports: [TableGeneric, MatIcon, SearchBar],
  templateUrl: './gestione-venditori.html',
  styleUrl: './gestione-venditori.css',
})
export class GestioneVenditori {
  utenti: any;

  constructor(
    private utenteService: UtenteServices,
  ) {
    this.utenti = this.utenteService.listUtente;
  }
  

  colonneUtenti: TableColumn[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'cognome', label: 'Cognome' },
  { key: 'dataNascita', label: 'Data di nascita' },
  { key: 'email', label: 'Email' },
  { key: 'indirizzo', label: 'Indirizzo' },
];

colonneVenditori: TableColumn[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'cognome', label: 'Cognome' },
  { key: 'dataNascita', label: 'Data di nascita' },
  { key: 'email', label: 'Email' },
  { key: 'partitaIva', label: 'Partita IVA' },
];


  ngOnInit(): void {
    this.utenteService.list();
  }

onSearch(query: string): void {
  this.utenteService.list(query);
}

}
