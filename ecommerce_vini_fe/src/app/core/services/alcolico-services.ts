import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { AlcolicoModel } from '../models/alcolico';
import { APP_SETTING } from '../../setting/token';
import { AppSettings } from '../../setting/config-model';

@Service()
export class AlcolicoServices {
     private readonly http = inject(HttpClient);
     alcolici = signal<AlcolicoModel[]>([]);

    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

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
