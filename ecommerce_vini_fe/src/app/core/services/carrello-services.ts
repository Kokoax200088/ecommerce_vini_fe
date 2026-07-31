import { inject, Service, signal} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { CarrelloModel, ProdottoAlcolico, ProdottoBox, ProdottoDegustazione } from '../models/carrello';
import { Observable, tap } from 'rxjs';
@Service()
export class CarrelloService {
    private readonly http = inject(HttpClient);
    cart = signal<CarrelloModel | undefined>(undefined);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;
    
    createProdAlcolico(body: Omit<ProdottoAlcolico, 'id'>) {
    return this.http.post<ProdottoAlcolico>(this.baseUrl + '/prodotto-alcolico/create', body);
  }

  createProdBox(body: Omit<ProdottoBox, 'id'>) {
    return this.http.post<ProdottoBox>(this.baseUrl + '/prodotto-box/create', body);
  }

  updateProdottoAlcolico(body: ProdottoAlcolico) {
    return this.http.patch<ProdottoAlcolico>(this.baseUrl + `/prodotto-alcolico/update`, body);
  }

  updateProdottoBox(body: ProdottoBox) {
    return this.http.patch<ProdottoBox>(this.baseUrl + `/prodotto-box/update`, body);
  }

  deleteProdottoAlcolico(id:number) {
    return this.http.delete(this.baseUrl + '/prodotto-alcolico/delete/' + id);
  }

  getByAlcolico(idAlcolico?: number, idCarrello?: number): Observable<ProdottoAlcolico[]> {
      let params = new HttpParams();

      if (idAlcolico !== undefined && idAlcolico !== null) {
        params = params.set('idAlcolico', idAlcolico);
      }
      if (idCarrello !== undefined && idCarrello !== null) {
        params = params.set('idCarrello', idCarrello);
      }

      return this.http.get<ProdottoAlcolico[]>(this.baseUrl + '/prodotto-alcolico/getByAlcolico', { params });
    }

  getByBox(idBox?:number, idCarrello?:number) {
    let params = new HttpParams();

    if(idBox !== undefined && idBox !== null)
      params = params.set('idBox', idBox);

    if(idCarrello !== undefined && idCarrello !== null)
      params = params.set('idCarrello', idCarrello);

    return this.http.get<ProdottoBox[]>(this.baseUrl + '/prodotto-box/getByBox', {params});
  }



  createProdDegustazione(body: Omit<ProdottoDegustazione, 'id'>) {
    return this.http.post<ProdottoDegustazione>(this.baseUrl + '/prodotto-degustazione/create', body);
  }

  updateProdottoDegustazione(body: ProdottoDegustazione) {
    return this.http.patch<ProdottoDegustazione>(this.baseUrl + `/prodotto-degustazione/update`, body);
  }

  deleteProdottoDegustazione(id:number) {
    return this.http.delete(this.baseUrl + '/prodotto-degustazione/delete/' + id);
  }

  getByDegustazione(idDegustazione?: number, idCarrello?: number): Observable<ProdottoDegustazione[]> {
      let params = new HttpParams();

      if (idDegustazione !== undefined && idDegustazione !== null) {
        params = params.set('idDegustazione', idDegustazione);
      }
      if (idCarrello !== undefined && idCarrello !== null) {
        params = params.set('idCarrello', idCarrello);
      }

      return this.http.get<ProdottoDegustazione[]>(this.baseUrl + '/prodotto-degustazione/getByDegustazione', { params });
    }

 

  getCartById(id:number) {
    return this.http.get<CarrelloModel>(this.baseUrl + '/cart/getById', {
      params: { id }
    }).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  clearCartState() {
  this.cart.set(undefined);
}

} 

