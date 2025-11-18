import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },

  {
    path: 'parking-spots',
    loadComponent: () =>
      import('./pages/parking-spots/parking-spots').then(m => m.ParkingSpotsPage)
  },
  {
    path: 'tariffs',
    loadComponent: () =>
      import('./pages/tariffs/tariffs').then(m => m.TariffsPage)
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./pages/tickets/tickets').then(m => m.TicketsPage)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users').then(m => m.UsersPage)
  },
];
