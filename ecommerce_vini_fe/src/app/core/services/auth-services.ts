import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AppSettings } from '../../setting/config-model';
import { MeDTO } from '../models/user';
import { APP_SETTING } from '../../setting/token';

@Service()
export class AuthServices {
    private platformId = inject(PLATFORM_ID);
    private readonly settings: AppSettings = inject(APP_SETTING);
    private http = inject(HttpClient);
    grant = signal(
        {
            userId: null as string | null,
            token: null as string | null,
            isLogged: false,
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

    setToken(token: string){
        this.grant.update(grant => ({
            ...grant,
            token: token
        }));
    }

    setAuthenticated(user: MeDTO){
        let admin = user.role === 'ADMIN' ? true : false;

        this.grant.update(grant => ({
            ...grant,
            isLogged: true,
            isAdmin: admin,
            userId: user.id
        }));
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
        return this.http.post(`/auth/registration`, body).subscribe( // ${this.settings.apiUrl}
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
        return this.http.post(`/auth/login`, body).subscribe( // ${this.settings.apiUrl}
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

    resetAll() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("token"); // TODO DEVI SETTARE E GETTARE IL TOKEN
            localStorage.removeItem("userId");
            localStorage.removeItem("isLogged");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("isSeller");
            localStorage.removeItem("isCustomer");
            this.grant.set({
                token: null,
                userId: null,
                isLogged: false,
                isAdmin: false,
                isSeller: false,
                isCustomer: false
            });
        }
    }
     
}
