import { inject, Injectable } from '@angular/core';
import { AppSettings } from '../../setting/config-model';
import { APP_SETTING } from '../../setting/token';
import { HttpClient } from '@angular/common/http';

export interface ImmagineModel {
    id: number;
    url: string;
}

@Injectable({ providedIn: 'root' })
export class UploadImageService {
    private readonly settings: AppSettings = inject(APP_SETTING);
    private readonly http = inject(HttpClient);

    private baseUrlFor(entity: string): string {
        return this.settings.apiUrl + `rest/api/immagine-${entity}/`;
    }

    create(entity: string, file: File, idParamName: string, idValue: number) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(idParamName, idValue.toString());
        return this.http.post(this.baseUrlFor(entity) + "create", formData);
    }

    update<T>(entity: string, req: T) {
        return this.http.patch(this.baseUrlFor(entity) + "update", req);
    }

    delete(entity: string, id: number) {
        return this.http.delete(this.baseUrlFor(entity) + "delete/" + id);
    }

    list<T>(entity: string, idParamName: string, idValue: number) {
        return this.http.get<T[]>(this.baseUrlFor(entity) + "list", {
            params: { [idParamName]: idValue }
        });
    }

    getById(entity: string, id: number) {
        return this.http.get(this.baseUrlFor(entity) + "getById", {
            params: { id }
        });
    }
}