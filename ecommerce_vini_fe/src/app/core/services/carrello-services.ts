import { inject, Service, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { CarrelloModel, ProdottoAlcolico } from '../models/carrello';
import { tap } from 'rxjs';
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
    return this.http.patch<ProdottoAlcolico>(`/prodotto-alcolico/update`, body);
  }

  deleteProdottoAlcolico(id:number) {
    return this.http.delete(this.baseUrl + '/cart/delete', {
            params: { id }
        });
  }

  getCartById(id:number) {
    return this.http.get<CarrelloModel>(this.baseUrl + '/cart/getById', {
      params: { id }
    }).pipe(
      tap(cart => this.cart.set(cart))
    );
  }
}