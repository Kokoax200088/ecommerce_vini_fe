import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { TokenServices } from "../security/token-services";
import { AuthServices } from "../services/auth-services";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenServices = inject(TokenServices);
  const authService = inject(AuthServices);

  const token = authService.grant().token;

  const publicUrls = [
    '/rest/api/auth/login',
    '/rest/api/auth/registration',
    '/rest/api/auth/refresh',
    '/rest/api/cliente/create',
    '/rest/api/utente/create',
    '/rest/api/venditore/create',
    '/rest/api/alcolico/list',
    '/rest/api/alcolico/get',
    '/rest/api/cantina/list',
    '/rest/api/cantina/get',
    '/rest/api/cantina-alcolico/list',
    '/rest/api/immagine-alcolico/getById',
    '/rest/api/immagine-cantina/getById',
    '/rest/api/immagine-box/getById',
    '/rest/api/immagine-degustazione/getById',
    '/rest/api/cantina-alcolico/list',
    '/rest/api/rating-alcolico/list',
    '/rest/api/rating-cantina/list',
    '/images/'
  ];

  // 1) Skip interception for public endpoints
  const shouldSkip = publicUrls.some(url => req.url.includes(url));
  if (shouldSkip) {
    return next(req);
  }

  // 2) Attach token (only if present)
  const requestToSend = token
    ? req.clone({ // costrutto if
        withCredentials: true,
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req.clone({ withCredentials: true }); //costrutto else

  return next(requestToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return tokenServices.refreshToken().pipe(
        switchMap(response => {
          authService.setToken(response.accessToken);

          // 3) Repeat the original request (not the raw req) in a consistent way
          const repeatedRequest = requestToSend.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          });

          return next(repeatedRequest);
        }),
        catchError(refreshError => {
            console.log("dovrei resettare sono in authInterceptor");
            //authService.resetAll();
            return throwError(() => refreshError);
        })
      );
    })
  );
};
