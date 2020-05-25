import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'tabla-pagos', name: 'Tabla de pagos', type: 'link', icon: 'av_timer' },
  { state: 'canales-comunicacion', type: 'link', name: 'Buttons', icon: 'crop_7_5' },
  {
    state: 'dialog',
    type: 'link',
    name: 'Dialog',
    icon: 'assignment_turned_in'
  }
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
