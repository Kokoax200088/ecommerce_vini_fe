import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ordineAlcolico, ordineAlcolicoReq } from '../models/ordineAlcolico';
import { APP_SETTING } from '../../setting/token';
import { AppSettings } from '../../setting/config-model';
import { ordineDegustazione } from '../models/ordineDegustazione';

@Injectable({
  providedIn: 'root'
})
export class OrdineAlcolicoService {
  private readonly http = inject(HttpClient);
  ordiniAlcolico = signal<ordineAlcolico[]>([]);
  private readonly settings: AppSettings = inject(APP_SETTING);
  baseUrl: string = this.settings.apiUrl;


  list(idOrdine?: number, idStatus?: number, idAlcolico?: number, idCantina?: number) {
        let params = new HttpParams();
        if (idOrdine) params = params.set('idOrdine', idOrdine);
        if (idStatus) params = params.set('idStatus', idStatus);
        if (idAlcolico) params = params.set('idAlcolico', idAlcolico);
        if (idCantina) params = params.set('idCantina', idCantina);

        this.http.get<ordineAlcolico[]>(this.baseUrl + "/ordinealcolico/list", { params })
            .subscribe({
                next: (resp) => this.ordiniAlcolico.set(resp),
                error: (err) => console.error('Errore nel caricamento ordini alcolici   ', err)
            });
    }

  getById(id: number): Observable<ordineAlcolico> {
    return this.http.get<ordineAlcolico>(`${this.baseUrl + "/ordinealcolico/getById"}/${id}`);
  }

  create(ordineAlcolico: ordineAlcolicoReq): Observable<ordineAlcolico> {
    return this.http.post<ordineAlcolico>(this.baseUrl + "/ordinealcolico/create", ordineAlcolico);
  }

  update(id: number, ordineAlcolico: ordineAlcolicoReq): Observable<ordineAlcolico> {
    return this.http.put<ordineAlcolico>(`${this.baseUrl+ "/ordinealcolico/update"}/${id}`, ordineAlcolico);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl+ "/ordinealcolico/delete"}/${id}`);
  }
}