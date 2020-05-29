import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppComponent } from './app.component';
import { AdminGuardService } from './core/guards/admin-guard.service';


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
        path: 'tabla-pagos',
        canActivate: [AdminGuardService],
        loadChildren: 
          () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AppComponent,
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
