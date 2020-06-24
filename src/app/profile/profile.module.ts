import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilepageComponent } from './profilepage/profilepage.component';

import { ChartistModule } from 'ng-chartist';
import { DemoMaterialModule } from '../demo-material-module';


@NgModule({
  declarations: [ProfilepageComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
