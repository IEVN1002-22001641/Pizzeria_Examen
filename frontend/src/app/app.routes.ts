import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pizzeria',
    loadComponent: () => 
      import('./pizzeria/main-pizzeria/main-pizzeria').then(m => m.MainPizzeria),
    children: [
      {
        path: 'pedidos',
        loadComponent: () => 
          import('./pizzeria/pedidos/pedidos').then(m => m.Pedidos)
      },
      {
        path: 'tabla-detalle',
        loadComponent: () => 
          import('./pizzeria/tabla-detalle/tabla-detalle').then(m => m.TablaDetalle)
      },
      {
        path: 'reportes',
        loadComponent: () => 
          import('./pizzeria/reporte-ventas/reporte-ventas').then(m => m.ReporteVentas)
      },
      {
        path: '',
        redirectTo: 'pedidos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'pizzeria/pedidos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pizzeria/pedidos'
  }
];