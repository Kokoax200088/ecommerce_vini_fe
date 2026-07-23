import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
//import { AutentificazioneServices } from "../security/autentificazione-services";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    //const autentificationServices = inject(AutentificazioneServices);
    const authService = inject(AuthService);
    const token = authService.grant().token;

    const publicUrls = [
        '/rest/api/auth/login',
        '/rest/api/auth/refresh',
        '/images/'
    ];

    let requestToSend = req.clone({
        withCredentials: true
    });

    if (token) { 
        requestToSend = requestToSend.clone({ 
            setHeaders: 
            { 
                Authorization: 'Bearer ' + token 
            } 
        });
    }
    return next(requestToSend).pipe(
        catchError((error: HttpErrorResponse) => { 

            if (error.status !== 401 ) { 
                    return throwError(() => error); 
                }
                
            console.log('Refresh.....')
            return autentificationServices.refreshToken().pipe(
                switchMap(response => { 
                    authService.setToken(response.accessToken); // save new token 
                   const repeatedRequest = req.clone({     // resend ol request with new token
                    withCredentials: true, 
                    setHeaders: { 
                        Authorization: 'Bearer ' + response.accessToken 
                    } }); 
                    return next(repeatedRequest); 
                }), 
                catchError(refreshError => { 
                    authService.resetAll(); 
                    return throwError(() => refreshError);
                 }
                ));
             }));
};