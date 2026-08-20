import { Routes } from '@angular/router';

import { Libros } from './pages/libros/libros';
import { ProveedorEstadisticas } from './pages/proveedor-estadisticas/proveedor-estadisticas';
import { ProveedorRecomendacion } from './pages/proveedor-recomendacion/proveedor-recomendacion';
import { ProveedorVentasComponent } from './pages/proveedor-ventas/proveedor-ventas';

export const proveedorRoutes: Routes = [
  {
    path: '',
    redirectTo: 'recomendaciones',
    pathMatch: 'full',
  },
  {
    path: 'proveedor-estadisticas',
    component: ProveedorEstadisticas,
  },
  {
    path: 'estadisticas',
    redirectTo: 'proveedor-estadisticas',
    pathMatch: 'full',
  },
  {
    path: 'recomendaciones',
    component: ProveedorRecomendacion,
  },
  {
    path: 'ventas',
    component: ProveedorVentasComponent,
  },
  {
    path: 'proveedor-recomendacion',
    redirectTo: 'recomendaciones',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'recomendaciones',
  },
];
