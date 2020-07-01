import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProfileDialogComponent } from '../../material-component/profile-dialog/profile-dialog.component';

import { SetDataService } from '../../core/services/set-data.service';
import { HoldDataService } from '../../core/services/hold-data.service';
import { FecthDataService } from '../../core/services/fecth-data.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore/interfaces';


@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {

  destroy$: Subject<void> = new Subject()
  doormanList:Array<any> = []; 
  buildingPassword:string = 'fcghijohghvbjnk'; // traser de firebase
  paymentLink:string = 'esrdtfghjkll'; // traer de firebase
  showAddDoormanButton:boolean = true;
  constructor(
    private dialog: MatDialog,
    // services
    private setData: SetDataService,
    private holdData: HoldDataService,
    private fetchData: FecthDataService
  ) { }

  ngOnInit(): void {
    console.log(this.holdData.buildingInfo, this.holdData.userId, this.holdData.userInfo);
    
    if(this.holdData.buildingInfo){
      this.getDoormanInfo();
    }else{
      setTimeout(() => {
        this.getDoormanInfo();
      }, 1000);
    }
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }


  getDoormanInfo(){
    // gets initial data of doorman
    this.fetchData.getBuidlingEmployees(this.holdData.buildingInfo.buildingId)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(doorman => {
      doorman.map(data => {
        const dataDoorman = data.payload.doc.data();
        this.doormanList.push(dataDoorman);
      })
      if(this.doormanList.length > 0){
        this.showAddDoormanButton = false;
      }
    })
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
    
    dialogRef.afterClosed().subscribe(result => {
      if(result.event === data.action){
        // create doorman account
        this.createDoormanAccount(result.data);
      }else{
        // do nothing
      }
    })
  }


  goToPaymentLink(){
    // re-direct user to the payment link
    let data = {
      action: 'paymentLink',
      paymentLink: this.paymentLink
    }
    const dialogRef = this.dialog.open(ProfileDialogComponent, {data: data})
  }

  
  private createDoormanAccount(data){
    // call firebase function of doorman account creation
    const doormanData = {
      email: data.email,
      password: data.password
    }
    this.setData.doormanCreationTrigger(this.holdData.buildingInfo.buildingId, doormanData);
  }
}
