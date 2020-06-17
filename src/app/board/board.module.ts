import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board/board.component';
import { DemoMaterialModule } from '../demo-material-module';


@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    DemoMaterialModule,
    FlexLayoutModule,
  ]
})
export class BoardModule { }
