import { inject, Service} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { CarrelloModel, ProdottoAlcolico } from '../models/carrello';
@Service()
export class CarrelloService {
    private readonly http = inject(HttpClient);
    private readonly settings: AppSettings = inject(APP_SETTING);

    baseUrl: string = this.settings.apiUrl;

    createProdAlcolico(body: Omit<ProdottoAlcolico, 'id'>) {
    return this.http.post<ProdottoAlcolico>(this.baseUrl + '/prodotto-alcolico/create', body);
  }

  getCartById(id:number) {
    return this.http.get<CarrelloModel>(this.baseUrl + '/cart/getById', {
            params: { id }
        });
  }
}