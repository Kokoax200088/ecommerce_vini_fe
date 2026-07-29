import { inject, Service, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_SETTING } from '../../setting/token';
import { Box } from '../models/box';
import { AppSettings } from '../../setting/config-model';
import { tap } from 'rxjs';

@Service()
export class BoxServices {
    private http = inject(HttpClient);
    listBox = signal<Box[]>([]);
    //forse servono info sugli alcolici?
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    getById(id: number){
        return this.http.get<Box>(this.baseUrl + "/box/get/" + id);
    }

    list(nomeBox?: string, idCantina?: number){
        let params = new HttpParams();
        if (nomeBox) params = params.set('nome', nomeBox);
        if (idCantina) params = params.set('idCantina', idCantina);

        this.http.get<Box[]>(this.baseUrl + "/box/list", {params})
            .subscribe({
                next: (resp) => {
                    console.log("listBox successful");
                    this.listBox.set(resp);
                },
                error: (err) => {
                    console.error("errore nel caricamento box", err);
                }
            })
    }

    create(body: {}){
        return this.http.post(this.baseUrl + "/box/create", body)
            .pipe(tap(() => this.list())); //a cosa serve?
    }

    update(body: {}){
        return this.http.put(this.baseUrl + "/box/update", body)
            .pipe(tap(() => this.list()));
    }

    delete(id:number){
        return this.http.delete(this.baseUrl + "/box/remove/" + id)
            .pipe(tap(() => this.list()));
    }

    addBoxAlcolico(body: {}){
        //TODO
    }

    deleteBoxAlcolico(id: number){
        //TODO
    }

    listBoxAlcolico(){
        //TODO
    }
}
