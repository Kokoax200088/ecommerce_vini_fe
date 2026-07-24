import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';

@Service()
export class UtenteServices {
    url = "http://localhost:9090/rest/api/utente/";
    listUtente = signal<any[]>([]);

  private readonly settings: AppSettings = inject(APP_SETTING); //
    private readonly http = inject(HttpClient);

        getBaseUrl(): string {
            console.log("trying to call getBaseUrl");
        return this.settings.apiUrl + 'utente/';
    }

    list(){
        this.http.get<any[]>(this.url + 'list')
            .subscribe({
                next: (resp) => {
                    this.listUtente.set(resp);
                }
            });
    }

    create(body:{}){
        return this.http.post(this.url + "create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: {}){
        return this.http.patch(this.getBaseUrl() + "update", body)
            .pipe(tap(() => this.list()));
    }


}
