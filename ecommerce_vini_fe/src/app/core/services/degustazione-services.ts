import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Degustazione } from '../models/degustazione';
import { APP_SETTING } from '../../setting/token';
import { AppSettings } from '../../setting/config-model';
import { Observable } from 'rxjs';

@Service()
export class DegustazioneServices {
    private readonly http = inject(HttpClient);
    degustazioni = signal<Degustazione[]>([]);

    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    getById(id: number) : Observable<Degustazione>{
        return this.http.get<Degustazione>(this.baseUrl + '/degustazione/getDegustazioneById', {
            params: new HttpParams().set('id', id)
        });
    }

    list(idCantina?: number, nome?: string) {
        let params = new HttpParams();
        if (idCantina != null) params = params.set('id_cantina', idCantina);
        if (nome) params = params.set('nome', nome);

        this.http.get<Degustazione[]>(this.baseUrl + '/degustazione/list', { params })
            .subscribe({
                next: (resp) => {
                    this.degustazioni.set(resp);
                },
                error: (err) => {
                    console.error('Errore nel caricamento degustazioni', err);
                }
            });
    }

    create(body: {}) {
        return this.http.post<{ msg: string, id: number }>(this.baseUrl + '/degustazione/create', body);
    }

    update(body: {}) {
        return this.http.patch(this.baseUrl + '/degustazione/update', body);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + '/degustazione/delete/' + id);
    }
}
