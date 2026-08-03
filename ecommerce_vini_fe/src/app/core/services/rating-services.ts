import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Service()
export class RatingServices {
    private readonly http = inject(HttpClient);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    createRatingAlcolico(body:{}) {
         return this.http.post<any>(this.baseUrl + '/rating-alcolico/create', body);
    }

     createRatingCantina(body:{}) {
         return this.http.post<any>(this.baseUrl + '/rating-cantina/create', body);
    }

    getListRatingAlcolico(nomeAlcolico: string, idUtente: number, valutazione: number) {
        let params = new HttpParams();
        if (nomeAlcolico) params = params.set('nomeAlcolico', nomeAlcolico);
        if (idUtente) params = params.set('id_utente', idUtente);
        if (valutazione) params = params.set('valutazione', valutazione);
         return this.http.get<any>(this.baseUrl + '/rating-cantina/list',{params});
    }

    getListRatingCantina(nomeCantina: string, idUtente: number, valutazione: number) {
        let params = new HttpParams();
        if (nomeCantina) params = params.set('nomeCantina', nomeCantina);
        if (idUtente) params = params.set('id_utente', idUtente);
        if (valutazione) params = params.set('valutazione', valutazione);
         return this.http.get<any>(this.baseUrl + '/rating-cantina/list' ,{params});
    }
}
