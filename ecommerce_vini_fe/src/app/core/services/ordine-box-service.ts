import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { ordineBoxReq, ordineBox } from '../models/ordineBox';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Injectable({ providedIn: 'root' })
export class OrdineBoxServices {
    private readonly http = inject(HttpClient);
    ordiniBox = signal<ordineBox[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    getById(id: number) {
        return this.http.get<ordineBox>(
            this.baseUrl + "/ordine-box/get/" + id
        );
    }

    list(quantita?: number, idOrdine?: number, idStatus?: number, idBox?: number, idCantina?: number) {
        let params = new HttpParams();
        if (quantita) params = params.set('quantita', quantita);
        if (idOrdine) params = params.set('idOrdine', idOrdine);
        if (idStatus) params = params.set('idStatus', idStatus);
        if (idBox) params = params.set('idBox', idBox);
        if (idCantina) params = params.set('idCantina', idCantina);

        this.http.get<ordineBox[]>(this.baseUrl + "/ordine-box/list", { params })
            .subscribe({
                next: (resp) => this.ordiniBox.set(resp),
                error: (err) => console.error('Errore nel caricamento ordini box', err)
            });
    }

    create(body: ordineBoxReq) {
        return this.http.post(this.baseUrl + "/ordine-box/create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: ordineBoxReq) {
        return this.http.put(this.baseUrl + "/ordine-box/update", body)
            .pipe(tap(() => this.list()));
    }

    remove(id: number) {
        return this.http.delete(this.baseUrl + "/ordine-box/remove/" + id)
            .pipe(tap(() => this.list()));
    }
}