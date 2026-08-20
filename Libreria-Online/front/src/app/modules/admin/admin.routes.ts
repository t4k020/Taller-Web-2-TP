import { Routes } from '@angular/router';
import { authGuard } from '../../services/Auth/auth-guard';

import { Admin } from './admin';
import { VerOfertas } from './pages/ver-ofertas/ver-ofertas';
import { SubastaAdmin } from './pages/subasta-admin/subasta-admin';
import { VerLibrosAdmin } from './pages/ver-libros-admin/ver-libros-admin';
import { StockAdmin } from './pages/stock-admin/stock-admin';
import { UsuariosAdmin } from './pages/usuarios-admin/usuarios-admin';
import { ActualizarLibro } from './components/actualizar-libro/actualizar-libro.js';
import { EliminarLibro } from './components/eliminar-libro/eliminar-libro.js';

export const adminRoutes: Routes = [
  {
    path: '',
    component: Admin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'ofertas',
    component: VerOfertas,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'usuarios',
    component: UsuariosAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'libros',
    component: VerLibrosAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'subastaAdmin',
    component: SubastaAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'stock',
    component: StockAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'actualizar-libro/:id',
    component: ActualizarLibro,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'eliminar-libro/:id',
    component: EliminarLibro,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
