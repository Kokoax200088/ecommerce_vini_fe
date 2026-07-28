import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin-guard';
import { customerGuard } from './core/auth/customer-guard';

export const routes: Routes = [
    // Utilizzo LazyLoading per caricare i componenti solo quando necessario.
  {
    path: '',
    loadComponent: () => import('./ui/pages/homepage/homepage').then((m) => m.Homepage),
  },
  {
    path: 'registration',
    loadComponent: () => import('./ui/pages/registration/registration').then((m) => m.Registration),
  },
  {
    path: 'gestione-utenti',
    loadComponent: () => import('./ui/pages/gestione-utenti/gestione-venditori').then((m) => m.GestioneVenditori),
  },
  {
    path: 'catalogo-cantine',
    loadComponent: () => import('./ui/pages/catalogo-cantine/catalogo-cantine').then((m) => m.CatalogoCantine),
  },
  {
    path: 'cantina-dettaglio/:id',
    loadComponent: () => import('./ui/pages/cantina-dettaglio/cantina-dettaglio').then((m) => m.CantinaDettaglio),
  },
  {
    path: 'alcolici',
    loadComponent: () => import('./ui/pages/lista-alcolici/lista-alcolici').then((m) => m.ListaAlcolici),
  },
  {
    path: 'gestione-ordine',
    loadComponent: () => import('./ui/pages/gestione-ordine/gestione-ordine').then((m) => m.GestioneOrdine),
  },
  {
    path: 'gestione-spedizione',
    loadComponent: () => import('./ui/pages/gestione-spedizione/gestione-spedizione').then((m) => m.GestioneSpedizione),
  },
  {
    path: 'gestione-spedizione-box',
    loadComponent: () => import('./ui/pages/gestione-spedizione-box/gestione-spedizione-box').then((m) => m.GestioneSpedizioneBox),
  },
  {
    path: 'login',
    loadComponent: () => import('./ui/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'profile',
    loadComponent: () => import('./ui/pages/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./ui/pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];