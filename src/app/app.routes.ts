import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './pages/authentication/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboards/dashboard1/dashboard1.component').then((m) => m.AppDashboard1Component),
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Dashboard' }
          ]
        }
      },
      {
        path: 'chamados',
        loadComponent: () =>
          import('./pages/suporte/suporte.component').then((m) => m.SuporteComponent),
        data: {
          title: 'Chamados de suporte',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Chamados' }
          ]
        }
      },
      {
        path: 'atividades',
        loadComponent: () =>
          import('./pages/atividades/atividades-admin.component').then((m) => m.AtividadesAdminComponent),
        data: {
          title: 'Atividades do admin',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Atividades' }
          ]
        }
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./pages/empresas/empresas-admin.component').then((m) => m.EmpresasAdminComponent),
        data: {
          title: 'Empresas',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Empresas' }
          ]
        }
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./pages/leads/leads-admin.component').then((m) => m.LeadsAdminComponent),
        data: {
          title: 'Leads da landing',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Leads' }
          ]
        }
      },
      {
        path: 'planos',
        loadComponent: () =>
          import('./pages/planos/planos-admin.component').then((m) => m.PlanosAdminComponent),
        data: {
          title: 'Planos da plataforma',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Planos' }
          ]
        }
      },
      {
        path: 'cupons',
        loadComponent: () =>
          import('./pages/cobranca-beneficios/cobranca-beneficios-admin.component').then((m) => m.CobrancaBeneficiosAdminComponent),
        data: {
          title: 'Cupons e benefícios',
          urls: [
            { title: 'Admin', url: '/dashboard' },
            { title: 'Cupons' }
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
            { title: 'Admin', url: '/dashboard' },
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
