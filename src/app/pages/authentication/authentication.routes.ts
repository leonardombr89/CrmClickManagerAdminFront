import { Routes } from '@angular/router';
import { AppBoxedLoginComponent } from './boxed-login/boxed-login.component';
import { AppErrorComponent } from './error/error.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: AppBoxedLoginComponent,
      },
      {
        path: 'error',
        component: AppErrorComponent,
      },
    ],
  },
];
