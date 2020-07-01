import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class HoldDataService {

  userInfoInRow:object; // variable used to pass data from table of payment to custom user profile in row
  userInfo:any;
  buildingInfo:any;
  userId:string;
  hideSpinner: boolean = false;
  constructor() { }


  convertJSDateIntoFirestoreTimestamp(){
    const time = firebase.firestore.FieldValue.serverTimestamp();
    return time;    
  }
}
