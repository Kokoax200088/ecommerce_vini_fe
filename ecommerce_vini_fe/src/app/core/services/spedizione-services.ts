import { inject, Injectable, Service, signal } from '@angular/core';
//import { AppSettings } from '../setting/config-model';
//import { APP_SETTING } from '../setting/token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';

@Service()
export class SpedizioneServices {
    private readonly http = inject(HttpClient);
    spedizioni = signal<any[]>([]);

    list(id?: number, corriere?: string, codice_tracciamento?: string, cantina?: any, cliente?: any, status?: any, ordine_alcolico?: any) {
        let params = new HttpParams();
        if (id) params = params.set('id', id);
        if (corriere) params = params.set('corriere', corriere);
        if (codice_tracciamento) params = params.set('codice_tracciamento', codice_tracciamento);
        if (cantina) params = params.set('cantina', cantina);
        if (cliente) params = params.set('cliente', cliente);
        if (status) params = params.set('status', status);
        if (ordine_alcolico) params = params.set('ordine_alcolico', ordine_alcolico);
        this.http.get("/rest/api/spedizione/list", { params })
            .subscribe({
                next: ((r: any) => this.spedizioni.set(r)),
            })
    }

    create(body: {}) {
        return this.http.post("/rest/api/spedizione/create", body)
            .pipe(tap(() => this.list()))
    }

    update(body: {}) {
        return this.http.patch("/rest/api/spedizione/update", body)
            .pipe(tap(() => this.list()))
    }

    delete(id: number) {
        return this.http.delete("/rest/api/spedizione/delete/" + id)
            .pipe(tap(() => this.list()))
    }
}