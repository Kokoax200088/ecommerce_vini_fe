import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth-services';

export const authGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthServices);
  const routing = inject(Router);

  return authServices.isLogged();
};
