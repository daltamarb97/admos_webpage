import { Component, OnInit } from '@angular/core';

import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-comunications',
  templateUrl: './comunications.component.html',
  styleUrls: ['./comunications.component.scss']
})
export class ComunicationsComponent implements OnInit {

  userId:string;
  user:any;   //component variable for global userInfo var
  chatRooms:Array<any> = []; 

  constructor(
    private fetchData: FecthDataService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    if(this.authService.userInfo){
      this.user = this.authService.userInfo;
      this.getChatRoomNames();
    }else{
      this.getUserId();
    }
  }


  getUserId(){
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.userId = user.uid; 
        this.getUserInfo();
      });
  }


  getUserInfo(){
    // get user Info to be used
    this.fetchData.getUserInfo(this.userId)
    .subscribe(user=>{
      this.user = user.data();
      // assign userInfo value to global variable
      this.authService.userInfo = this.user;
      // execute functions thta rely on userInfo
      this.getChatRoomNames();
    })
  }


  getChatRoomNames(){
    // get chat rooms names
    this.fetchData.getChatRooms(this.user.activeBuilding)
    .subscribe(data => {
      data.map(a=>{
        const data= a.payload.doc.data();
        this.chatRooms.push(data);
      });
      
    })
    
  }
}
