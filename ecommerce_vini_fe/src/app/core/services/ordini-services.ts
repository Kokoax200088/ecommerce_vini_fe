import { inject, Injectable, Service, signal } from '@angular/core';
//import { AppSettings } from '../setting/config-model';
//import { APP_SETTING } from '../setting/token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { Ordine } from '../models/ordine';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Service()
export class OrdiniServices {
  //  private readonly settings: AppSettings = inject(APP_SETTING);
    private readonly http = inject(HttpClient);
    ordini = signal<Ordine[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);
    baseUrl: string = this.settings.apiUrl;
 /*   getBaseUrl(): string {
        return this.settings.apiUrl + 'ordine/';
    } */

    list(data?: string, totale?: number, id_status?: number, id_utente?: number, indirizzo_destinazione?: string) {
    let params = new HttpParams();
    if (data) params = params.set('data', data);
    if (totale) params = params.set('totale', totale);
    if (id_status) params = params.set('id_status', id_status);
    if (id_utente) params = params.set('id_utente', id_utente);
    if (indirizzo_destinazione) params = params.set('indirizzo_destinazione', indirizzo_destinazione);

    this.http.get(this.baseUrl + "/ordine/list", { params })
        .subscribe({
            next: (r: any) => this.ordini.set(r),
            error: (err) => console.error('Errore caricamento ordini:', err)
        })
    }


    create(body: {}) {
        return this.http.post<Ordine>(this.baseUrl + "/ordine/create", body)
            .pipe(tap(() => this.list()));
    }
    
    update(body: {}) {
        return this.http.patch(this.baseUrl +"/ordine/update", body)
        .pipe(tap(() => this.list()))
    }
    
    delete(id: number) {
        return this.http.delete(this.baseUrl +"/ordine/delete/" + id)
        .pipe(tap(() => this.list()))
    }
}