import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin-guard';
import { customerGuard } from './core/auth/customer-guard';

export const routes: Routes = [
    //Utilizzo LazyLoading per caricare i componenti solo quando necessario.
  {
    path: '',
    loadComponent: () => import('./ui/pages/homepage/homepage').then((m) => m.Homepage),
    canActivate: [adminGuard, customerGuard]
  },
   {
    path: 'registration',
    loadComponent: () => import('./ui/pages/registration/registration').then((m) => m.Registration),
  },
 {
    path: 'gestione-venditori',
    loadComponent: () => import('./ui/pages/gestione-venditori/gestione-venditori').then((m) => m.GestioneVenditori),
    canActivate: [adminGuard]
  },
];
