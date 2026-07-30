import { inject, Service, signal} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { CarrelloModel, ProdottoAlcolico } from '../models/carrello';
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

  updateProdottoAlcolico(body: ProdottoAlcolico) {
    return this.http.patch<ProdottoAlcolico>(this.baseUrl + `/prodotto-alcolico/update`, body);
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