import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { AlcolicoServices } from '../../../core/services/alcolico-services';
import { CantinaServices } from '../../../core/services/cantina-services';
import { AuthServices } from '../../../core/services/auth-services';
import { CardAlcolico } from "../../../components/card-alcolico/card-alcolico";
import { SearchBar } from "../../../components/search-bar/search-bar";

@Component({
  selector: 'app-lista-alcolici',
  imports: [CardAlcolico, SearchBar, MatIcon],
  templateUrl: './lista-alcolici.html',
  styleUrl: './lista-alcolici.css',
})
export class ListaAlcolici {
  alcolici : any;
  idInEliminazione = signal<number | undefined>(undefined);
  msgErrore = signal<string>('');

  public readonly auth = inject(AuthServices);

  constructor(private alcolicoService: AlcolicoServices, private cantinaService: CantinaServices){
    this.alcolici = this.alcolicoService.alcolici;
  }

   ngOnInit(): void {
    this.alcolicoService.list();
  }

  onSearch(query: string): void {
    this.alcolicoService.list(undefined, undefined, query);
  }

  chiediConferma(id: number): void {
    this.msgErrore.set('');
    this.idInEliminazione.set(id);
  }

  annullaEliminazione(): void {
    this.idInEliminazione.set(undefined);
  }

  elimina(id: number): void {
    this.cantinaService.getCantinaAlcolicoByFilter(undefined, id).subscribe({
      next: (righe) => {
        const scollegamenti = (righe ?? []).map((r) => this.cantinaService.deleteCantinaAlcolico(r.id));
        if (scollegamenti.length === 0) {
          this.eliminaAlcolico(id);
          return;
        }
        forkJoin(scollegamenti).subscribe({
          next: () => this.eliminaAlcolico(id),
          error: (err) => this.fallita(err)
        });
      },
      error: (err) => this.fallita(err)
    });
  }

  private eliminaAlcolico(id: number): void {
    this.alcolicoService.delete(id).subscribe({
      next: () => {
        this.idInEliminazione.set(undefined);
        this.msgErrore.set('');
      },
      error: (err) => this.fallita(err)
    });
  }

  private fallita(err: any): void {
    console.error('Errore nella cancellazione alcolico', err);
    this.idInEliminazione.set(undefined);
    this.msgErrore.set('Impossibile eliminare: l\'alcolico è collegato a ordini, carrelli o altri elementi.');
  }
}
