import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient} from "@angular/common/http";
import { APP_SETTING } from './setting/token';

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
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(), provideHttpClient()
  ]
};
