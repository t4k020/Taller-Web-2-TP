import { Routes } from '@angular/router';
import { HomeUser } from './layouts/home-user/home-user';
import { Register } from './layouts/register/register';
import { Login } from './layouts/login/login';
import { LibrosDigitales } from './modules/comprador/pages/libros-digitales/libros-digitales';
import { Estanteria } from './modules/estanteria/estanteria';
import { CarritoComponent } from './modules/carrito/carrito-component/carrito-component';
import { authGuard } from './services/Auth/auth-guard';
import { homeRedirectGuard } from './services/Auth/home-redirect-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeUser,
    canActivate: [homeRedirectGuard],
  },
  {
    path: 'proveedor',
    loadChildren: () =>
      import('./modules/proveedor/proveedor.routes').then((m) => m.proveedorRoutes),
    canActivate: [authGuard],
    data: { roles: ['PROVEEDOR'] },
  },
  {
    path: 'comprador/libros-digitales',
    component: LibrosDigitales,
    canActivate: [authGuard],
    data: { roles: ['COMPRADOR'] },
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'libros',
    component: Estanteria,
    canActivate: [authGuard],
    data: { roles: ['COMPRADOR', 'ADMIN'] },
  },
  {
    path: 'carrito',
    component: CarritoComponent,
    canActivate: [authGuard],
    data: { roles: ['COMPRADOR'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
