import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoldDataService {

  userInfoInRow:object; // variable used to pass data from table of payment to custom user profile in row

  constructor() { }
}
