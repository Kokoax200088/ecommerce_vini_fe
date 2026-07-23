import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth-services';

export const sellerGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthServices);
  
  return authServices.isSeller();
};
