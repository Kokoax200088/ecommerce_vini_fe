import { inject, Service } from '@angular/core';
import { AppSettings } from '../../setting/config-model';
import { HttpClient } from '@angular/common/http';
import { LoginDTO, LoginReq, MeDTO } from '../models/user';
import { Observable, switchMap, tap, finalize, shareReplay, catchError, throwError } from 'rxjs';
import { AuthServices } from '../services/auth-services';
//import { APP_SETTING } from '../setting/token';

@Service()
export class TokenServices {
//    private readonly settings: AppSettings = inject(APP_SETTING);
    private readonly http = inject(HttpClient);
    private readonly authServices = inject(AuthServices);

    getBaseUrl(): string {
        console.log('trying to get baseurl in token-services');
        return '';
//        retrun this.settings.apiUrl + 'auth/';
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

        if (this.refreshRequest$) {  // in cas of refresh laready running
            return this.refreshRequest$;
        }

        this.refreshRequest$ = this.http.post<LoginDTO>(this.getBaseUrl() + "refresh", {}, { withCredentials: true })
            .pipe(
                tap(resp => { this.authServices.setToken(resp.accessToken) }),
                catchError(error => {  //eccezione tipo
                    this.authServices.logout(); //NELLA REPO VEICOLI E' RESETALL()
                    return throwError(() => error);
                }),
                finalize(() => { // onEnd
                    this.refreshRequest$ = null;
                }),
                shareReplay({ // "share response with all request running at same time" CHECK
                    bufferSize: 1,
                    refCount: false
                })
            )

        return this.refreshRequest$;
    }
}
