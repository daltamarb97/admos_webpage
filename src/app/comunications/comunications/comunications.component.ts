import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';
import { SetDataService } from '../../core/services/set-data.service';

import { ChatCreationDialogComponent } from '../../material-component/chat-creation-dialog/chat-creation-dialog.component';

@Component({
  selector: 'app-comunications',
  templateUrl: './comunications.component.html',
  styleUrls: ['./comunications.component.scss']
})
export class ComunicationsComponent implements OnInit {

  userId:string;
  user:any;   //component variable for global userInfo var
  chatRooms:Array<any> = [];  // list of names of rooms
  chatMessages: Array<any> = []; // array of messages of specific room
  currentMessage:string; // message to be send
  currentRoomData = {
    name: '',
    id: '',
    description: ''
  }  // information of selected room chat


  constructor(
    private fetchData: FecthDataService,
    private setData: SetDataService,
    private authService: AuthService,
    // UI components
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
      this.getUserId();
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
    this.fetchData.getChatRooms(this.userId)
    .subscribe(data => {
      data.map(a=>{
        const data= a.payload.doc.data();
        this.chatRooms.push(data);
      });
      // getting messages od default room on init
      this.getMessagesFromRoom(this.chatRooms[0]);
    })
  }


  getMessagesFromRoom(data){
    this.currentRoomData = {
      name: data.roomName,
      id: data.roomId,
      description: data.roomDescription
    }
    this.chatMessages = []; //clear the array on click
    // get messages from room in firestore
    this.fetchData.getMessagesFromSpecificRoom(
      this.user.activeBuilding, 
      data.roomId
    ).subscribe(messages => {  
      messages.map(m=>{
        const message = m.payload.doc.data(); 
        this.chatMessages.push(message)
      })
    })
  }



  addChatRoom(){
    const dialogRef = this.dialog.open(ChatCreationDialogComponent);

    dialogRef.afterClosed()
    .subscribe(result =>{
      // bring building data
      this.fetchData.getBuildingInfo(this.user.activeBuilding)
      .subscribe((data)=>{
        const buildingName = data.data().name;
        // create new chat room  
        const roomData = {
          roomName: result.data.name,
          roomDescription: result.data.description
        }
        this.setData.createChatRoom(
          this.user.activeBuilding, 
          buildingName, 
          roomData, 
          this.userId
        );
      })  
    })  
  }


  sendMessage(){
    // send message in specific room
    const messageData = {
      name: this.user.name,
      lastname: this.user.lastname,
      msg: this.currentMessage,
      timestamp: Date.now(),
      userId: this.userId
    }

    this.setData.sendChatMessage(this.user.activeBuilding, this.currentRoomData.id, messageData)
    .then(()=>{
      // put the chat input in blank
      this.currentMessage = '';
    })
  }


  getParticipantsOfRoom(currentRoomData){
    console.log('show participants logic');
    console.log(currentRoomData);
  }
}
