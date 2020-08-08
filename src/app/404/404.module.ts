
import { NotfoundComponent } from './notfound/notfound.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './404-routing.module';


@NgModule({
  declarations: [NotfoundComponent],
  imports: [
    CommonModule,
    NotFoundRoutingModule
  ]
})
export class NotFoundModule { }
