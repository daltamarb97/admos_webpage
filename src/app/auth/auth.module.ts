import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DemoMaterialModule } from '../demo-material-module';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [SignUpComponent, LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DemoMaterialModule
  ]
})
export class AuthModule { }
