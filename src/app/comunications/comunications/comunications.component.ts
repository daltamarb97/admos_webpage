import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';
import { SetDataService } from '../../core/services/set-data.service';
import { DeleteDataService } from '../../core/services/delete-data.service';

import { ChatCreationDialogComponent } from '../../material-component/chat-creation-dialog/chat-creation-dialog.component';

import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HoldDataService } from '../../core/services/hold-data.service';
import * as firebase  from "firebase"
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ActivatedRoute, Router } from '@angular/router';

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
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  destroy$: Subject<void> = new Subject();

  userId:string;
  activeBuilding:string;
  chatRooms:Array<any> = [];  // list of names of rooms
  privateChats:Array<any> = [];  // list of names of rooms
  privateChatsNames:any = [];
  currentPrivateChat:any;
  chatMessages: Array<any> = []; // array of messages of specific room
  currentMessage:string; // message to be send
  currentRoomData: currentRoomData;  // information of selected room chat
  currentRoomParticipants: Array<any> = []; // information of current room participants
  residentsData:Array<any> = []; // residents list
  employeesData:Array<any> = []; // employees list
  showDetail:boolean = false;
  person;
  receiver;
  constructor(
    private fetchData: FecthDataService,
    private setData: SetDataService,
    private holdData: HoldDataService,
    private deleteData: DeleteDataService,
    // UI components
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private router: Router,private route: ActivatedRoute,
  ) {
    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     //if the chat doesn't exist yet, it come from the directoryPage
    //     this.person = this.router.getCurrentNavigation().extras.state.person;
    //     console.log(this.person);
    //     if (this.person === undefined) {
          
    //     } else {
    //      this.receiver = this.person;
    //     }
    //   }
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     //if the chat exist, it come from the homePage
    //    this.chatInfo = this.router.getCurrentNavigation().extras.state.chatInfo;
    //    console.log("tengo el chatInfo.id",this.chatInfo);      
    //    if(this.chatInfo == undefined || this.chatInfo == null){
    //      console.log("estoy undefined");
         
    //    }else{
    //      this.receiver = this.chatInfo;
 
    //      this.getMessages();
    //    }
    //  }
    // });
   
  }


  ngOnInit(): void {
    this.userId = this.holdData.userId;
    this.activeBuilding = this.holdData.userInfo.activeBuilding;
    this.getChatRoomNames();
    this.getPrivateMessages();
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*******************
  ROOM CHAT
  *******************/
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
      // create new chat room  +

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

  //JUAN colocar aqui una async await
  sendMessage(){
    // send message in specific room
    // que esto se cargue antes que que se mande el chat
    const messageData = {
      name: this.holdData.userInfo.name,
      lastname: this.holdData.userInfo.lastname,
      msg: this.currentMessage,
      timestamp:firebase.firestore.FieldValue.serverTimestamp(),
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

  showDetails(){

    if (this.showDetail === true) {
      this.showDetail = false
      
    } else if(this.showDetail === false){
      this.showDetail = true

    }
  }

  /*******************
  END OF ROOM CHAT
  *******************/


/*******************
PRIVATE CHAT
*******************/
  getPrivateMessages(){
    // get names from private messages 
    this.fetchData.getPrivateChats(this.userId)
    .subscribe(data => {
      data.map(a=>{
        console.log(a);

        if(a.type === 'added'){
          const data= a.payload.doc.data(); 
          this.privateChats.push(data);
          console.log(this.privateChats);
          
        }else if( a.type === 'removed'){
          for(let i in this.privateChats){
            if(this.privateChats[i].chatId === this.currentRoomData.id){
              const index = parseInt(i);
              this.privateChats.splice(index, 1);
            }
          }
        }
      });
      // getting messages of default room on init
    })
  }

  getMessagesFromPrivateChat(data){
    this.currentPrivateChat = {
      name: data.name,
      id: data.chatId,
      lastname: data.lastname,
    }
    this.chatMessages = []; //clear the array on click
    // get messages from room in firestore
    this.fetchData.getSpecificChat(
      data.chatId
    ).subscribe(messages => {  
      messages.map(m=>{
        const message = m.payload.doc.data(); 
        this.privateChats.push(message)
        console.log(message);
        
      })
    })
    // this.getParticipantsFromRoom();
  }

  
   //JUAN colocar aqui una async await
   sendPrivateMessage(){
    // send message in specific room
    // que esto se cargue antes que que se mande el chat
    const privateMessageData = {
      name: this.holdData.userInfo.name,
      lastname: this.holdData.userInfo.lastname,
      msg: this.currentMessage,
      timestamp:firebase.firestore.FieldValue.serverTimestamp(),
      userId: this.userId
    }

    this.setData.sendPrivateChatMessage(this.currentPrivateChat.id, privateMessageData)
    .then(()=>{
      // put the chat input in blank
      this.currentMessage = '';
    })
  }
/*******************
END OF PRIVATE CHAT
*******************/
 

  
  

  

  

// SEND THE PRIVATE MESSAGE
//   send(){
  
//     if(this.text != ""){
//       // Add a new document with a generated id.
//       console.log(this.chats);
//       if(this.chats == undefined || this.chats.length == 0){
//         let chatId = this.fs.createId();
//         console.log(this.text);
//         console.log(this);
        
//         this.setDataService.KeyToSender(this.user.userId,chatId,this.receiver);
//         this.setDataService.KeyToReceiver(this.receiver.userId,chatId,this.user)
//         .then(()=>{
//           this.setDataService.setDirectMessages(chatId,this.user.userId,this.text);

//           this.text = "";
//           this.getMessages();
//         });
       
//       } else {
//         console.log(this.chats);
        
//         this.setDataService.setDirectMessages(this.chatInfo.chatId,this.user.userId,this.text);
//         this.text = "";
//    }
//   }  
//  }

  // ------------------------------------
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  

}
