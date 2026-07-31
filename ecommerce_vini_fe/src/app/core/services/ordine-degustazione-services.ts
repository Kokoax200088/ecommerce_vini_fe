// core/services/ordine-degustazione-services.ts

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { ordineDegustazioneReq, ordineDegustazione } from '../models/ordineDegustazione';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Injectable({ providedIn: 'root' })
export class OrdineDegustazioneServices {
    private readonly http = inject(HttpClient);
    ordiniDegustazione = signal<ordineDegustazione[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    getById(id: number) {
        return this.http.get<ordineDegustazione>(
            this.baseUrl + "/rest/api/ordine-degustazione/get/" + id
        );
    }

    list(quantita?: number, idOrdine?: number, idStatus?: number, idDegustazione?: number, idCantina?: number) {
        let params = new HttpParams();
        if (quantita) params = params.set('quantita', quantita);
        if (idOrdine) params = params.set('idOrdine', idOrdine);
        if (idStatus) params = params.set('idStatus', idStatus);
        if (idDegustazione) params = params.set('idDegustazione', idDegustazione);
        if (idCantina) params = params.set('idCantina', idCantina);

        this.http.get<ordineDegustazione[]>(this.baseUrl + "/rest/api/ordine-degustazione/list", { params })
            .subscribe({
                next: (resp) => this.ordiniDegustazione.set(resp),
                error: (err) => console.error('Errore nel caricamento ordini degustazione', err)
            });
    }

    create(body: ordineDegustazioneReq) {
        return this.http.post(this.baseUrl + "/rest/api/ordine-degustazione/create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: ordineDegustazioneReq) {
        return this.http.put(this.baseUrl + "/rest/api/ordine-degustazione/update", body)
            .pipe(tap(() => this.list()));
    }

    remove(id: number) {
        return this.http.delete(this.baseUrl + "/rest/api/ordine-degustazione/remove/" + id)
            .pipe(tap(() => this.list()));
    }
}