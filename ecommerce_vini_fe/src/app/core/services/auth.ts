import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { envirorment } from '../../utils/envirorment';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class AuthService {
    private platformId = inject(PLATFORM_ID);
    url = envirorment.apiUrl;
    private http = inject(HttpClient);
    grant = signal(
        {
            isAdmin: false,
            isSeller: false,
            isCustomer: false
        }
    );

    constructor() {
        if(isPlatformBrowser(this.platformId)){
            console.log("Restore------");
            const isLogged = localStorage.getItem("isLogged");
            const isAdmin = localStorage.getItem("isAdmin");
            const isSeller = localStorage.getItem("isSeller");
            const isCustomer = localStorage.getItem("isCustomer");
        }
    }

    setAdmin() {
        if(isPlatformBrowser(this.platformId)){
            localStorage.setItem("isAdmin", "1");
            this.grant.update( grant => ({
                ...grant,
                isAdmin: true
            }));
        }
    }

    setSeller() {
        if(isPlatformBrowser(this.platformId)){
            localStorage.setItem("isSeller", "1");   
            this.grant.update( grant => ({
                ...grant,
                isSeller: true
            }));
        }
    }

    setCustomer() {
        if(isPlatformBrowser(this.platformId)){
            localStorage.setItem("isCustomer", "1");
            this.grant.update( grant => ({
                ...grant,
                isCustomer: true
            }));
        }
    }

    isAdmin(): boolean {
        if(isPlatformBrowser(this.platformId)){
            const isAdmin = localStorage.getItem("isAdmin");
            if(isAdmin === null && isAdmin === "1") {
                return true;
            }
            return false;
        }
        return false;
    }

    
    isSeller(): boolean {
        if(isPlatformBrowser(this.platformId)){
            const isSeller = localStorage.getItem("isSeller");
            if(isSeller === null && isSeller === "1") {
                return true;
            }
            return false;
        }
        return false;
    }

    isCustomer(): boolean {
        if(isPlatformBrowser(this.platformId)){
            const isCustomer = localStorage.getItem("isCustomer");
            if(isCustomer === null && isCustomer === "1") {
                return true;
            }
            return false;
        }
        return false;
    }

    isLogged(): boolean {
        if(isPlatformBrowser(this.platformId)){
            const isLogged = localStorage.getItem("isLogged");
            if(isLogged === null && isLogged === "1") {
                return true;
            }
            return false;
        }
        return false;
    }

    registration(body: any) {
        return this.http.post(`${this.url}/auth/registration`, body).subscribe(
            (response: any) => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem("isLogged", "1");
                    // TODO: aggiungere casi admin, venditore e cliente e reindirizzamento alle rispettive pagine (chiama set admin ecc);
                    if (response.role === 'ADMIN') {
                        this.setAdmin();
                    }
                    if (response.role === 'SELLER') {
                        this.setSeller();
                    }
                    if (response.role === 'CUSTOMER') {
                        this.setCustomer();
                    }
                }
            }
        ); //TODO: aggiungere url corretto
    }

     login(body: any) {
        return this.http.post(`${this.url}/auth/login`, body).subscribe(
            (response: any) => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem("isLogged", "1");
                     if (response.role === 'ADMIN') {
                        this.setAdmin();
                    }
                    if (response.role === 'SELLER') {
                        this.setSeller();
                    }
                    if (response.role === 'CUSTOMER') {
                        this.setCustomer();
                    }
                }
            }
        ); //TODO: aggiungere url corretto
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("isLogged");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("isSeller");
            localStorage.removeItem("isCustomer");
            this.grant.set({
                isAdmin: false,
                isSeller: false,
                isCustomer: false
            });
        }
    }
     
}
