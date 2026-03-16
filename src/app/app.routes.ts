import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chamados',
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'chamados',
      },
      {
        path: 'chamados',
        loadComponent: () =>
          import('./pages/suporte/suporte.component').then((m) => m.SuporteComponent),
        data: {
          title: 'Chamados de suporte',
          urls: [
            { title: 'Admin', url: '/chamados' },
            { title: 'Chamados' }
          ]
        }
      },
      {
        path: 'chamados/:id',
        loadComponent: () =>
          import('./pages/suporte/suporte.component').then((m) => m.SuporteComponent),
        data: {
          title: 'Detalhe do chamado',
          urls: [
            { title: 'Admin', url: '/chamados' },
            { title: 'Chamados', url: '/chamados' },
            { title: 'Detalhe' }
          ]
        }
      }
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  }
];
