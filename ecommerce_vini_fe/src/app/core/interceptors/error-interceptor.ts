import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthServices } from '../services/auth-services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthServices);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      switch (error.status) {
        case 401:
          //authService.logout();
          //router.navigate(['/login']);
          console.log("ma mica sto uscendo AO");
          break;

        case 403:
          router.navigate(['/']); 
          break;

        case 404:
          console.error('Risorsa non trovata:', req.url);
          router.navigate(['/not-found']);
          break;

        default:
          console.error('Errore HTTP:', error.status, error.message);
      }
      return throwError(() => error);
    })
  );
};