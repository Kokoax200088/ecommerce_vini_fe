import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AlcolicoModel, Colore, TipologiaAlcolico } from '../models/alcolico';
import { APP_SETTING } from '../../setting/token';
import { AppSettings } from '../../setting/config-model';

@Service()
export class AlcolicoServices {
     private readonly http = inject(HttpClient);
     alcolici = signal<AlcolicoModel[]>([]);
     tipologie = signal<TipologiaAlcolico[]>([]);
     colori = signal<Colore[]>([]);

    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    getById(id: number) {
        return this.http.get<AlcolicoModel>(this.baseUrl + '/alcolico/get/' + id);
    }

    listTipologie() {
        this.http.get<TipologiaAlcolico[]>(this.baseUrl + '/tipologia-alcolico/list')
            .subscribe({
                next: (resp) => {
                    this.tipologie.set(resp);
                },
                error: (err) => {
                    console.error('Errore nel caricamento tipologie', err);
                }
            });
    }

    listColori() {
        this.http.get<Colore[]>(this.baseUrl + '/colore/list')
            .subscribe({
                next: (resp) => {
                    this.colori.set(resp);
                },
                error: (err) => {
                    console.error('Errore nel caricamento colori', err);
                }
            });
    }

    create(body: {}) {
        return this.http.post(this.baseUrl + '/alcolico/create', body)
            .pipe(tap(() => this.list()));
    }

    update(body: {}) {
        return this.http.put(this.baseUrl + '/alcolico/update', body)
            .pipe(tap(() => this.list()));
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + '/alcolico/remove/' + id)
            .pipe(tap(() => this.list()));
    }

    list(idColore?: number, idTipologia?: number, nome?: string, gradazione?: number, annata?: number){
  let params = new HttpParams();

  if (idColore != null) {
    params = params.set('idColore', idColore);
  }
  if (idTipologia != null) {
    params = params.set('idTipologia', idTipologia);
  }
  if (nome) {
    params = params.set('nome', nome);
  }
  if (gradazione != null) {
    params = params.set('gradazione', gradazione);
  }
  if (annata != null) {
    params = params.set('annata', annata);
  }

  this.http.get<AlcolicoModel[]>(this.baseUrl + '/alcolico/list', { params })
    .subscribe({
      next: (resp) => {
        this.alcolici.set(resp);
      },
      error: (err) => {
        console.error('Errore nel caricamento alcolici', err);
      }
    });
}

}
