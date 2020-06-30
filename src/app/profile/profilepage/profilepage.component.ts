import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProfileDialogComponent } from '../../material-component/profile-dialog/profile-dialog.component';


@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {

  testList: Array<string> = ['hola', 'perro', 'gato']; // traser de firebase
  buildingPassword:string = 'fcghijohghvbjnk'; // traser de firebase
  paymentLink:string = 'esrdtfghjkll'; // traer de firebase
  constructor(
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
  }


  changeProfilePic(){
    console.log('hice click');
    
  }

  testClick(test){
    console.log(test);
  }


  copyMessage(){
    // logiv to copy the building password
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.buildingPassword;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  
  addDoorman(){
    // add a new doorman
    let data = {
      action: 'doorman'
    }
    const dialogRef = this.dialog.open(ProfileDialogComponent, {data: data})
  }


  goToPaymentLink(){
    // re-direct user to the payment link
    let data = {
      action: 'paymentLink',
      paymentLink: this.paymentLink
    }
    const dialogRef = this.dialog.open(ProfileDialogComponent, {data: data})
  }
}
