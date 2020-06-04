import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';

// guards
import {  EmailVerifiedGuardService } from './core/guards/email-verified.service';
import { CurrentUserGuard } from './core/guards/current-user-guard.service';


export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/tabla-pagos',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: 
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'tabla-pagos',
        canActivate: [
          CurrentUserGuard,
          EmailVerifiedGuardService
        ],
        loadChildren: 
          () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'canales-comunicacion',
        loadChildren:
          () => import('./comunications/comunications.module').then(m => m.ComunicationsModule)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren:
      () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
