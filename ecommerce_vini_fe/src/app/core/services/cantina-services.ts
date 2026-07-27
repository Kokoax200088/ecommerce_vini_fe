import { inject, Service, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { Cantina } from '../models/cantina';
@Service()
export class CantinaServices {
    private readonly http = inject(HttpClient);
    cantine = signal<Cantina[]>([]);

    getById(id: number) {
        //@GetMapping("/get/{id}") BE
        return this.http.get<Cantina>("/rest/api/cantina/get/" + id);
    }

    list(nomeCantina?: string, idVenditore?: number) {
        let params = new HttpParams();
        if (nomeCantina) params = params.set('nomeCantina', nomeCantina);
        if (idVenditore) params = params.set('idVenditore', idVenditore);

        //@GetMapping("/list") BE
        this.http.get("/rest/api/cantina/list", { params })
            .subscribe({
                next: ((r: any) => this.cantine.set(r)),
            });
    }

    create(body: {}) {
        //@PostMapping("/create") BE
        return this.http.post("/rest/api/cantina/create", body)
            .pipe(tap(() => this.list()));
    }

    update(body: {}) {
        //@PutMapping("/update") BE
        return this.http.put("/rest/api/cantina/update", body)
            .pipe(tap(() => this.list()));
    }

    delete(id: number) {
        //@DeleteMapping("/remove/{id}") BE
        return this.http.delete("/rest/api/cantina/remove/" + id)
            .pipe(tap(() => this.list()));
    }
}