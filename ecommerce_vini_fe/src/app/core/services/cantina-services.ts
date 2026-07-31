import { inject, Service, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { Cantina, CantinaALcolico } from '../models/cantina';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { AlcolicoModel } from '../models/alcolico';
@Service()
export class CantinaServices {
    private readonly http = inject(HttpClient);
    cantine = signal<Cantina[]>([]);
    alcolici = signal<CantinaALcolico[]>([]);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;
    
    getById(id: number) {
        return this.http.get<Cantina>(this.baseUrl +"/cantina/get/" + id);
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

    listAlcolici(idCantina?: number) {
        let params = new HttpParams();
        if (idCantina) params = params.set('idCantina', idCantina);

        this.http.get<CantinaALcolico[]>(this.baseUrl + "/cantina-alcolico/list", { params })
            .subscribe({
                next: (resp) => {
                     this.alcolici.set(resp);
                },
                error: (err) => {
                    console.error('Errore nel caricamento cantine', err);
                }
            });
    }

    listCantinaAlcolicoByAlcolico(idAlcolico: number) {
        let params = new HttpParams().set('idAlcolico', idAlcolico);
        return this.http.get<CantinaALcolico[]>(this.baseUrl + "/cantina-alcolico/list", { params });
    }

     updateCantinaAlcolico(body: {}) {
        return this.http.put<CantinaALcolico>(this.baseUrl + "/cantina-alcolico/update", body)
            .pipe(tap(() => this.list()));
    }

    getIdCantinaALcolico(id: number) {
    return this.http.get<CantinaALcolico>(this.baseUrl + "/cantina-alcolico/get/" + id);
}

getCantinaAlcolicoByFilter(idCantina: number | undefined, idAlcolico: number| undefined) {
    let params = new HttpParams();
    if (idCantina != null) params = params.set('idCantina', idCantina);
    if (idAlcolico != null) params = params.set('idAlcolico', idAlcolico);

    return this.http.get<CantinaALcolico[]>(this.baseUrl + "/cantina-alcolico/list", { params });
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