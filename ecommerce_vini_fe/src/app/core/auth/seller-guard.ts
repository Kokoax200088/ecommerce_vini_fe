import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const sellerGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthService);
  
  return authServices.isSeller();
};
