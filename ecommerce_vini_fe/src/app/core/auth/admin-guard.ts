import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth-services';

export const adminGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthService);

  return authServices.isAdmin();
};
