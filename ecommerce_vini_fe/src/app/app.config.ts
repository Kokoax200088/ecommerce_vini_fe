import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import { APP_SETTING } from './setting/token';
import { authInterceptor } from './core/interceptors/authInterceptor';
import { firstValueFrom } from 'rxjs';
import { errorInterceptor } from './core/interceptors/error-interceptor';

// aggiungo provider Http Client x richieste http al BE.
export const appConfig: ApplicationConfig = {
  
  providers: [
    {
      provide:APP_SETTING,
      useValue: {
        apiUrl: 'http://localhost:8080/rest/api',
        pageSize: 4
      }
    }, 
     provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])    // interceptor registration
    ),
      provideAppInitializer(() => { // service to execute in startup
      const refreshService = inject(AutentificazioneServices);
      return firstValueFrom(refreshService.restoreSession()) // execute refresh in startup

    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(),
  ]
};
