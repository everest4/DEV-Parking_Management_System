import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { LayoutPage } from './layout/layout';

export const routes: Routes = [
  // Login = first page
  { path: '', component: LoginPage },

  // Everything after login goes inside layout shell
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home').then(m => m.HomePage),
      },
      {
        path: 'parking-spots',
        loadComponent: () =>
          import('./pages/parking-spots/parking-spots').then(m => m.ParkingSpotsPage),
      },
      {
        path: 'tariffs',
        loadComponent: () =>
          import('./pages/tariffs/tariffs').then(m => m.TariffsPage),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./pages/tickets/tickets').then(m => m.TicketsPage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users').then(m => m.UsersPage),
      }
    ]
  }
];
