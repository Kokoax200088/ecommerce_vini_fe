import { Component } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { TableColumn, TableGeneric } from '../../../components/table-column/table-column';
import { MatIcon } from "@angular/material/icon";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { switchMap } from 'rxjs';

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
  { key: 'ruolo', label: 'Ruolo' },
];


  ngOnInit(): void {
    this.utenteService.list();
  }

onSearch(nome: string): void {
  this.utenteService.list(nome);
}

onDelete(row: any, role: string) {
  let deleteRoleSpecifico$;

  if (role === 'cliente') {
    deleteRoleSpecifico$ = this.utenteService.deleteCliente(row.clienteDTO.id);
  } else if (role === 'venditore') {
    deleteRoleSpecifico$ = this.utenteService.deleteVenditore(row.venditoreDTO.id);
  } else {
     this.utenteService.deleteUtente(row.id);
     return;
  }

  deleteRoleSpecifico$.pipe(
    switchMap(() => this.utenteService.deleteUtente(row.id))
  ).subscribe({
    next: () => console.log("utente eliminato correttamente"),
    error: (err) => console.log("errore durante la cancellazione:", err)
  });
}

}
