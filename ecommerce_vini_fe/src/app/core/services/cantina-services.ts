import { inject, Service, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { Cantina } from '../models/cantina';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
@Service()
export class CantinaServices {
    private readonly http = inject(HttpClient);
    cantine = signal<Cantina[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;
    
    getById(id: number) {
        return this.http.get<Cantina>("/cantina/get/" + id);
    }

    list(nomeCantina?: string, idVenditore?: number) {
        let params = new HttpParams();
        if (nomeCantina) params = params.set('nomeCantina', nomeCantina);
        if (idVenditore) params = params.set('idVenditore', idVenditore);

        this.http.get<Cantina[]>(this.baseUrl + "/cantina/list", { params })
            .subscribe({
                next: (resp) => {
                     this.cantine.set(resp);
                },
                error: (err) => {
                    console.error('Errore nel caricamento cantine', err);
                }
            });
    }

    create(body: {}) {
        //@PostMapping("/create") BE
        return this.http.post(this.baseUrl + "/cantina/create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: {}) {
        //@PutMapping("/update") BE
        return this.http.put(this.baseUrl + "/cantina/update", body)
            .pipe(tap(() => this.list()));
    }

    delete(id: number) {
        //@DeleteMapping("/remove/{id}") BE
        return this.http.delete(this.baseUrl + "/cantina/remove/" + id)
            .pipe(tap(() => this.list()));
    }
}