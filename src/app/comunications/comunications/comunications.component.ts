import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FecthDataService } from '../../core/services/fecth-data.service';
import { SetDataService } from '../../core/services/set-data.service';
import { DeleteDataService } from '../../core/services/delete-data.service';

import { ChatCreationDialogComponent } from '../../material-component/chat-creation-dialog/chat-creation-dialog.component';

import { Subject } from 'rxjs';
import { HoldDataService } from '../../core/services/hold-data.service';
import { takeUntil } from 'rxjs/operators';

export class currentRoomData {
  name:string;
  roomId:string;
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
  buildingId:string;
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
    this.buildingId = this.holdData.userInfo.buildingId;
    this.getChatRoomNames();
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }


   getChatRoomNames(){
    // get chat rooms names
    this.fetchData.getChatRooms(this.userId)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(data => {
      data.map(a=>{
        if(a.type === 'added'){
          const data= a.payload.doc.data(); 
          this.chatRooms.push(data);
          
        }else if( a.type === 'removed'){
          for(let i in this.chatRooms){
            if(this.chatRooms[i].roomId === this.currentRoomData.roomId){
              const index = parseInt(i);
              this.chatRooms.splice(index, 1);
            }
          }
        }
      });
      // getting messages of default room on init
      const currentDate = new Date();
      this.getMessagesFromRoom(this.chatRooms[0], currentDate, 1);     
    })
  }


  getMessagesFromRoom(data, timestamp, limit){
    this.currentRoomData = {
      name: data.roomName,
      roomId: data.roomId,
      description: data.roomDescription,
    }
    this.chatMessages = []; //clear the array on click
    this.getMessagesFirebase(data, timestamp, limit);
    this.getParticipantsFromRoom();
  }


  moreMessages(){
    console.log(this.currentRoomData);
    console.log(this.chatMessages[0]);
    
    const timestampToCompare = this.chatMessages[0].timestamp;
    this.getMessagesFirebase(this.currentRoomData, timestampToCompare, 1)
  }


  private getMessagesFirebase(data, timestamp, limit) {
     // get messages from room in firestore
     this.fetchData.getMessagesFromSpecificRoom(
      this.buildingId, 
      data.roomId,
      timestamp,
      limit
    )
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(res => {  
      if (this.chatMessages.length !== 0) {
        const holdMessages = [];
        holdMessages.push(...this.chatMessages);
        this.chatMessages = [];
        res.map(msg => {
          const response = msg.payload.doc.data();
          const singleMessage = {
            ...response,
            timestamp: response.timestamp.toDate(),
          }
          this.chatMessages.unshift(singleMessage);
        });
        this.chatMessages.push(...holdMessages);
      }else {
        res.map(msg => {
          const response = msg.payload.doc.data();
          const singleMessage = {
            ...response,
            timestamp: response.timestamp.toDate(),
          }
          this.chatMessages.unshift(singleMessage);
        });
      } 
    })
  }


  private getParticipantsFromRoom(){
    this.currentRoomParticipants = []; //clear the array on click
    // get participants of current room
    this.fetchData.getParticipantsFromSpecificRoom(
      this.buildingId, 
      this.currentRoomData.roomId
    )
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(participants => {
      participants.map(p=>{
        const participant = p.payload.doc.data(); 
        this.currentRoomParticipants.push(participant)
      })
    })
  }


  addChatRoom(){
    const dialogRef = this.dialog.open(ChatCreationDialogComponent, {data: this.buildingId});

    dialogRef.afterClosed()
    .subscribe(result =>{
      // create new chat room  

      const roomData = {
        roomName: result.data.name,
        roomDescription: result.data.description
      }
      const participants: Array<any> = result.data.participants;

      this.setData.createChatRoom(
        this.buildingId, 
        roomData, 
        this.userId,
        participants
      );  
    })  
  }


  sendMessage(){
    // send message in specific room
    const timestamp = this.holdData.convertJSDateIntoFirestoreTimestamp();
    const messageData = {
      name: this.holdData.userInfo.name,
      lastname: this.holdData.userInfo.lastname,
      message: this.currentMessage,
      timestamp: timestamp,
      userId: this.userId
    }

    const tempData = {
      name: this.holdData.userInfo.name,
      lastname: this.holdData.userInfo.lastname,
      message: this.currentMessage,
      timestamp: new Date,
      userId: this.userId
    }
    this.chatMessages.push(tempData);
    this.setData.sendChatMessage(this.buildingId, this.currentRoomData.roomId, messageData)
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
        this.deleteData.deleteChatRoom(this.buildingId, this.currentRoomData.roomId, this.userId);
      }else{
        // do nothing
      }
    })
  }
}
