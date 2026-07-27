import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Service()
export class UtenteServices {
    //url = "http://localhost:9090/rest/api/utente/";
    listUtente = signal<any[]>([]);

  private readonly settings: AppSettings = inject(APP_SETTING);
        private readonly http = inject(HttpClient);

        getBaseUrlUtente(): string {
            console.log("trying to call getBaseUrlUtente");
        return this.settings.apiUrl + '/utente/';
        }

        getBaseUrlCliente(): string {
            console.log("trying to call getBaseUrlCliente");
        return this.settings.apiUrl + '/cliente/';
        }

        getBaseUrlVenditore(): string {
            console.log("trying to call getBaseUrlVenditore");
        return this.settings.apiUrl + '/venditore/';
        }

    list(
        nome?: string, 
        cognome?: string, 
        email?: string, 
        dataNascita?: string, 
        ruolo?: string
    ){
        let params = new HttpParams();
        if (nome) params = params.set('nome', nome);
        if (cognome) params = params.set('cognome', cognome);
        if (email) params = params.set('email', email);
        if (dataNascita) params = params.set('dataNascita', dataNascita);
        if (ruolo) params = params.set('ruolo', ruolo);

        this.http.get<any[]>(this.getBaseUrlUtente() + 'listWithParameters', {params})
            .subscribe({
                next: (resp) => {
                    this.listUtente.set(resp);
                }
            });
    }

    create(body:{}){
        console.log("trying to create utente: " + body);
        return this.http.post<Text>(this.getBaseUrlUtente() + "create", body)
            .pipe(tap(() => this.list()));
    }

    createCliente(body: {}){  //dovrei creare service a parte? sounds useless here
        console.log("inside the service, createCliente: " + body);
        return this.http.post(this.getBaseUrlCliente() + "create", body)
            .pipe(tap(() => this.list()));
    }

    createVenditore(body: {}){
        console.log("inside the service, createCliente: " + body);
        return this.http.post(this.getBaseUrlVenditore() + "create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: {}){
        return this.http.patch(this.getBaseUrlUtente() + "update", body)
            .pipe(tap(() => this.list()));
    }

    findByUsername(id?: string){
        return this.http.get(this.getBaseUrlUtente() + "user/getById");
    }

    changePassword(body: {}){
        return this.http.put(this.getBaseUrlUtente() + "user/changePassword", body); //TODO non c'è il controller ancora
    }
}
