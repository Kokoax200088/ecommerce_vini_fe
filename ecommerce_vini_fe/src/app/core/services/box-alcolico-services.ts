import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { BoxAlcolico } from '../models/box';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { AlcoliciCantina } from '../../components/alcolici-cantina/alcolici-cantina';
import { CantinaALcolico } from '../models/cantina';
import { tap } from 'rxjs';

@Service()
export class BoxAlcolicoServices {
    private http = inject(HttpClient); 
    selectedBoxAlcolico = signal<BoxAlcolico | undefined>(undefined);

    private readonly settings : AppSettings = inject(APP_SETTING);

    baseUrl: string  = this.settings.apiUrl;

    getById(id: number){
        return this.http.get<BoxAlcolico>(this.baseUrl + "/boxAlcolico/getBoxAlcolicoById/" + id);
    }

    findMaxNumber(item: BoxAlcolico, listAlcolicoCantina: CantinaALcolico[]): number {        
        for (const cantinaAlcolico of listAlcolicoCantina) {
            if (cantinaAlcolico.alcolico.id === item.alcolico.id) {
                return Math.trunc(cantinaAlcolico.quantita/item.quantita);
            }
        }

        return 0;
    }

    list(idCantina: number | undefined, idBox: number | undefined){
        let params = new HttpParams();
        if (idCantina && idCantina !== undefined) params = params.set('idCantina', idCantina);
        if (idBox && idBox !== undefined) params = params.set('idBox', idBox);

        return this.http.get<BoxAlcolico[]>(this.baseUrl + "/boxAlcolico/list", {params});
    }

    create(body: {}){
        return this.http.post(this.baseUrl + "/boxalcolico/create", body)
            .pipe(tap(() => this.list(undefined, undefined)));
    }

    delete(id:number){
        return this.http.delete(this.baseUrl + "/boxalcolico/delete/"+ id)
            .pipe(tap(() => this.list(undefined, undefined)));
    }
}
