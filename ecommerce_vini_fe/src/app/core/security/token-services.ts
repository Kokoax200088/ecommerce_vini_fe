import { inject, PLATFORM_ID, Service } from '@angular/core';
import { AppSettings } from '../../setting/config-model';
import { HttpClient } from '@angular/common/http';
import { LoginDTO, LoginReq, MeDTO } from '../models/user';
import { Observable, switchMap, tap, finalize, shareReplay, catchError, throwError, map, of } from 'rxjs';
import { AuthServices } from '../services/auth-services';
import { APP_SETTING } from '../../setting/token';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class TokenServices {
    private readonly settings: AppSettings = inject(APP_SETTING);

    private readonly http = inject(HttpClient);
    private readonly authServices = inject(AuthServices);
    private readonly platformId = inject(PLATFORM_ID);

    getBaseUrl(): string {
        console.log('trying to get baseurl in token-services');
        return this.settings.apiUrl + '/auth/';
    }

    login(body: LoginReq): Observable<MeDTO> {
        return this.http.post<LoginDTO>(this.getBaseUrl() + 'login', body, {withCredentials: true})
            .pipe(
                tap(resp => {
                    this.authServices.setToken(resp.accessToken)
                }),
                switchMap(() => this.me())
            );
    }

    me(): Observable<MeDTO> {
        return this.http.get<MeDTO>(this.getBaseUrl() + "me").pipe(
            tap(user => this.authServices.setAuthenticated(user))
        );
    }

    logout(){
        return this.http.post(this.getBaseUrl() + 'logout', {}, {withCredentials: true})
    }

    private refreshRequest$: Observable<LoginDTO> | null = null;

    refreshToken(): Observable<LoginDTO> {
        const isBrowser = isPlatformBrowser(this.platformId);

        if (isBrowser) {
            return throwError(() => new Error("refreshToken called during SSR"));
        }

        if (this.refreshRequest$) {  // in caso of refresh already running
            console.log("refresh already running");
            return this.refreshRequest$;
        }

        console.log("INSIDE REFRESHTOKEN... ... ...");
        this.refreshRequest$ = this.http.post<LoginDTO>(this.getBaseUrl() + "refresh", {}, { withCredentials: true })
            .pipe(
                tap(resp => {
                    console.log("init refresh now"); 
                    this.authServices.setToken(resp.accessToken) 
                }),
                catchError(error => {  //eccezione tipo
                    this.authServices.resetAll();
                    return throwError(() => error);
                }),
                finalize(() => { // onEnd
                    this.refreshRequest$ = null;
                }),
                shareReplay({ // "share response with all request running at same time" CHECK
                    bufferSize: 1,
                    refCount: true
                })
            )
        
        return this.refreshRequest$;
    }

    restoreSession(): Observable<boolean> {
        return this.refreshToken().pipe(
            switchMap(() =>
                this.me()
            ),
            tap(user => {
                this.authServices.setAuthenticated(user);
            }),
            map(() => true),
            catchError(() => {
                this.authServices.resetAll();
                return of(false);
            })
        )
    }
}
