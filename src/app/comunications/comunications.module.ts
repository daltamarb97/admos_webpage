import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ComunicationsRoutingModule } from './comunications-routing.module';
import { ComunicationsComponent } from './comunications/comunications.component';
import { DemoMaterialModule } from '../demo-material-module';


@NgModule({
  declarations: [ComunicationsComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ComunicationsRoutingModule
  ]
})
export class ComunicationsModule { }
