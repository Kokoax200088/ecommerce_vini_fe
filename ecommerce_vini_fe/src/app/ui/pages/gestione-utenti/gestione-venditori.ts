import { Component, computed, effect, inject } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { TableColumn, TableGeneric } from '../../../components/table-column/table-column';
import { MatIcon } from "@angular/material/icon";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { filter, switchMap } from 'rxjs';
import { AuthServices } from '../../../core/services/auth-services';
import { NotificationServices } from '../../../core/services/notification-services';
import { DeleteUser } from '../../../dialogs/delete-user/delete-user';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gestione-venditori',
  imports: [TableGeneric, MatIcon, SearchBar],
  templateUrl: './gestione-venditori.html',
  styleUrl: './gestione-venditori.css',
})
export class GestioneVenditori {
  utenti: any;

  
  private utenteService = inject(UtenteServices);
  private authService = inject(AuthServices);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationServices);

  loggedUtente = computed(() => this.utenteService.loggedUtente());

  constructor(
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
     const userId = this.authService.grant()?.userId ?? undefined;
  this.utenteService.findLoggedInfos(userId);
    this.utenteService.list();
  }

onSearch(nome: string): void {
  this.utenteService.list(nome);
}

onDelete(row: any, role: string) {
  const dialogRef = this.dialog.open(DeleteUser, {
    width: '450px',
    data: {
      title: 'Conferma eliminazione',
      message: `Sei sicuro di voler eliminare ${row.nome} ${row.cognome}?`
    }
  });

  dialogRef.afterClosed().pipe(
    filter(confirmed => confirmed === true)
  ).subscribe(() => this.eseguiDelete(row, role));
}

private eseguiDelete(row: any, role: string) {
  let deleteRoleSpecifico$;

  if (role === 'cliente') {
    deleteRoleSpecifico$ = this.utenteService.deleteCliente(row.clienteDTO.id);
  } else if (role === 'venditore') {
    deleteRoleSpecifico$ = this.utenteService.deleteVenditore(row.venditoreDTO.id);
  } else {
    this.utenteService.deleteUtente(row.id).subscribe({
      next: () => {
        this.notification.success('Utente eliminato correttamente');
        this.utenteService.list();
      },
      error: () => this.notification.error('Errore durante l\'eliminazione')
    });
    return;
  }

}

isCurrentUser(rowId: number | string): boolean {
  const loggedId = this.loggedUtente()?.id;
  if (!loggedId || !rowId) return false;
  return Number(loggedId) === Number(rowId);
}

}
