import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'shipments',
        loadComponent: () =>
          import('./pages/shipments/shipments.component').then(m => m.ShipmentsComponent)
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
