import { inject, Injectable, Service, signal } from '@angular/core';
//import { AppSettings } from '../setting/config-model';
//import { APP_SETTING } from '../setting/token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Service()
export class SpedizioneBoxServices {
    private readonly http = inject(HttpClient);
    spedizioniBox = signal<any[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);
    baseUrl: string = this.settings.apiUrl;

    list(id?: number, corriere?: string, codice_tracciamento?: string, cantina?: any, cliente?: any, status?: any, box?: any) {
        let params = new HttpParams();
        if (id) params = params.set('id', id);
        if (corriere) params = params.set('corriere', corriere);
        if (codice_tracciamento) params = params.set('codice_tracciamento', codice_tracciamento);
        if (cantina) params = params.set('cantina', cantina);
        if (cliente) params = params.set('cliente', cliente);
        if (status) params = params.set('status', status);
        if (box) params = params.set('ordine_box', box);
        this.http.get(this.baseUrl+"/spedizionebox/list", { params })
            .subscribe({
                next: ((r: any) => this.spedizioniBox.set(r)),
            })
    }

    create(body: {}) {
        console.log("SpedizioneBoxService create with body: " + JSON.stringify(body));
        return this.http.post(this.baseUrl+"/spedizionebox/create", body)
            .pipe(tap(() => this.list()))
    }

    update(body: {}) {
        return this.http.patch(this.baseUrl+"/spedizionebox/update", body)
            .pipe(tap(() => this.list()))
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl+"/spedizionebox/delete/" + id)
            .pipe(tap(() => this.list()))
    }
}