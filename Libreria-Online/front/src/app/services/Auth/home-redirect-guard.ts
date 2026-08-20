import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const homeRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  switch (authService.tipoUsuario()) {
    case 'ADMIN':
      return router.createUrlTree(['/admin']);
    case 'PROVEEDOR':
      return router.createUrlTree(['/proveedor/recomendaciones']);
    default:
      return true;
  }
};
