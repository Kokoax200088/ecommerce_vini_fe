import { Component, computed, effect, inject } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { TableColumn, TableGeneric } from '../../../components/table-column/table-column';
import { MatIcon } from "@angular/material/icon";
import { SearchBar } from "../../../components/search-bar/search-bar";
import { filter } from 'rxjs';
import { AuthServices } from '../../../core/services/auth-services';
import { NotificationServices } from '../../../core/services/notification-services';
import { DeleteUser } from '../../../dialogs/delete-user/delete-user';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gestione-utenti',
  imports: [TableGeneric, MatIcon, SearchBar],
  templateUrl: './gestione-utenti.html',
  styleUrl: './gestione-utenti.css',
})
export class GestioneUtenti {
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

private eseguiDelete(row: any, role: any) {
  let deleteRoleSpecifico$;

  let nomeRuolo = '';
  if (typeof role === 'string') {
    nomeRuolo = role;
  } else if (role && typeof role === 'object' && role.nome) {
    nomeRuolo = role.nome;
  }

  const ruoloNormalizzato = nomeRuolo.toLowerCase();
  console.log('Ruolo normalizzato per eliminazione:', ruoloNormalizzato, row);

  if (ruoloNormalizzato === 'cliente') {
    const idCliente = row.clienteDTO?.id ?? row.id; // Fallback di sicurezza sull'id utente se il DTO è piatto
    deleteRoleSpecifico$ = this.utenteService.deleteCliente(idCliente);
  } else if (ruoloNormalizzato === 'venditore') {
    const idVenditore = row.venditoreDTO?.id ?? row.id;
    deleteRoleSpecifico$ = this.utenteService.deleteVenditore(idVenditore);
  } else {
    this.utenteService.deleteUtente(row.id).subscribe({
      next: () => {
        this.notification.success('Utente eliminato correttamente');
        this.utenteService.list();
      },
      error: () => this.notification.error("Errore durante l'eliminazione")
    });
    return;
  }

  if (deleteRoleSpecifico$) {
    deleteRoleSpecifico$.subscribe({
      next: () => {
        this.notification.success('Utente eliminato correttamente');
        this.utenteService.list();
      },
      error: () => this.notification.error("Errore durante l'eliminazione")
    });
  }
}

isCurrentUser(rowId: number | string): boolean {
  const loggedId = this.loggedUtente()?.id;
  if (!loggedId || !rowId) return false;
  return Number(loggedId) === Number(rowId);
}

}
