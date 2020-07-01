import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';
import { SetDataService } from '../../core/services/set-data.service';
import { DeleteDataService } from '../../core/services/delete-data.service';

import { ChatCreationDialogComponent } from '../../material-component/chat-creation-dialog/chat-creation-dialog.component';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HoldDataService } from '../../core/services/hold-data.service';

export class currentRoomData {
  name:string;
  id:string;
  description:string;
}

@Component({
  selector: 'app-comunications',
  templateUrl: './comunications.component.html',
  styleUrls: ['./comunications.component.scss']
})
export class ComunicationsComponent implements OnInit {

  destroy$: Subject<void> = new Subject();

  userId:string;
  activeBuilding:string;
  chatRooms:Array<any> = [];  // list of names of rooms
  chatMessages: Array<any> = []; // array of messages of specific room
  currentMessage:string; // message to be send
  currentRoomData: currentRoomData;  // information of selected room chat
  currentRoomParticipants: Array<any> = []; // information of current room participants
  residentsData:Array<any> = []; // residents list
  employeesData:Array<any> = []; // employees list
  
  constructor(
    private fetchData: FecthDataService,
    private setData: SetDataService,
    private holdData: HoldDataService,
    private deleteData: DeleteDataService,
    // UI components
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.userId = this.holdData.userId;
    this.activeBuilding = this.holdData.userInfo.activeBuilding;
    this.getChatRoomNames();
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }


   getChatRoomNames(){
    // get chat rooms names
    this.fetchData.getChatRooms(this.userId)
    .subscribe(data => {
      data.map(a=>{
        if(a.type === 'added'){
          const data= a.payload.doc.data(); 
          this.chatRooms.push(data);
        }else if( a.type === 'removed'){
          for(let i in this.chatRooms){
            if(this.chatRooms[i].roomId === this.currentRoomData.id){
              const index = parseInt(i);
              this.chatRooms.splice(index, 1);
            }
          }
        }
      });
      // getting messages of default room on init
      this.getMessagesFromRoom(this.chatRooms[0]);
    })
  }


  getMessagesFromRoom(data){
    this.currentRoomData = {
      name: data.roomName,
      id: data.roomId,
      description: data.roomDescription,
    }
    this.chatMessages = []; //clear the array on click
    // get messages from room in firestore
    this.fetchData.getMessagesFromSpecificRoom(
      this.activeBuilding, 
      data.roomId
    ).subscribe(messages => {  
      messages.map(m=>{
        const message = m.payload.doc.data(); 
        this.chatMessages.push(message)
      })
    })
    this.getParticipantsFromRoom();
  }


  private getParticipantsFromRoom(){
    this.currentRoomParticipants = []; //clear the array on click
    // get participants of current room
    this.fetchData.getParticipantsFromSpecificRoom(
      this.activeBuilding, 
      this.currentRoomData.id
    ).subscribe(participants => {
      participants.map(p=>{
        const participant = p.payload.doc.data(); 
        this.currentRoomParticipants.push(participant)
      })
    })
  }


  addChatRoom(){
    const dialogRef = this.dialog.open(ChatCreationDialogComponent, {data: this.activeBuilding});

    dialogRef.afterClosed()
    .subscribe(result =>{
      // create new chat room  

      const roomData = {
        roomName: result.data.name,
        roomDescription: result.data.description
      }
      const participants: Array<any> = result.data.participants;

      this.setData.createChatRoom(
        this.activeBuilding, 
        roomData, 
        this.userId,
        participants
      );  
    })  
  }


  sendMessage(){
    // send message in specific room
    const messageData = {
      name: this.holdData.userInfo.name,
      lastname: this.holdData.userInfo.lastname,
      msg: this.currentMessage,
      timestamp: Date.now(),
      userId: this.userId
    }

    this.setData.sendChatMessage(this.activeBuilding, this.currentRoomData.id, messageData)
    .then(()=>{
      // put the chat input in blank
      this.currentMessage = '';
    })
  }


  deleteChatRoom(){
    // delete current chat room
    const dialogRef = this.dialog.open(ChatCreationDialogComponent,{data: 'delete'});
    dialogRef.afterClosed()
    .subscribe(result => {
      if(result.data === 'delete'){
        this.deleteData.deleteChatRoom(this.activeBuilding, this.currentRoomData.id, this.userId);
      }else{
        // do nothing
      }
    })
  }
}
