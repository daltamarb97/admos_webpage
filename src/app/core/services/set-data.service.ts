import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SetDataService {

  constructor(
    private db: AngularFirestore,
    private http: HttpClient
  ) { }


  // PAYMENTS TABLE SERVICES

  setTableData(buildingId, data){
    // set data to a specific payment table using Excel
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')

    return ref.add(data).then((docRef)=>{
        ref.doc(docRef.id).update({
          rowId: docRef.id,
          manualEmail: false,
          pending_to_pay: data.amount_to_pay
        })
    })
  }

  
  updateSingleRow(buildingId, rowId, data){
    // update single row data in firebase
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')
    .doc(rowId)

    return ref.update(data).then(()=>{
      console.log('updated successfully');    
    });
  }


  updatePendingToPay(buildingId:string, rowId:string, data, paymentData:object){
    // update pending_to_pay data in firebase table
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')
    .doc(rowId)

    return ref.update({
      pending_to_pay: data
    }).then(()=>{
      this.updatePaymentRecords(rowId, paymentData);
    });
  }


  private updatePaymentRecords(rowId:string, paymentData:object){
    let ref = this.db.collection('payments_records')
    .doc(rowId)
    .collection('record_of_payments')

    return ref.add(paymentData).then(docRef => {
      const paymentId = docRef.id;
      // update paymentId
      ref.doc(paymentId)
      .update({
        paymentId: paymentId
      }).then(()=> console.log('payment updated successfully'));
    })
  }


  setFirestoreTriggerPaymentEmail(buildingId,rowId){
    // set 'manualEmail' boolean to DB to trigger payment email sending
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')
    .doc(rowId)

    ref.update({
      manualEmail: true
    }).then(()=>{
      // setting property 'manualEmail' to false to be recall in the future, DO THIS IN CLOUD FUNCTION AND DELETE FROM HERE
      setTimeout(() => {
        // give time to cloud function to execute
        ref.update({
          manualEmail: false
        }).then(()=>{
          console.log('progress completed');
        })
      }, 3000);
    })
  }

  // END OF PAYMENTS TABLE SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // USER CREATION SERVICES

  setNewBuilding(buildingData, adminData, adminId){
    // set the building inf
    let ref = this.db.collection('buildings')

    return ref.add(buildingData).then((docRef)=>{
      let buildingId = docRef.id;
      ref.doc(buildingId).update({
        buildingId: buildingId,
        buildingPassword: this.createRandomBuildingPassword(),
        paymentLink: 'Cuenta Gratuita'
      }).then(()=>{
        // creates user with admin property 
        this.createNewAdminUser(adminData, adminId, buildingId);
        // creates default chatRoom for this building
        // General is the default chat room
        this.createDefaultChatRoom(
          buildingId, 
          buildingData.name, 
          {roomName: 'General', 
          roomDescription: 'Sala de chat dónde todos los miembros del edificio estan automáticamente'
          }, 
          adminId
        );
      })
    })
  }


  private createRandomBuildingPassword(){
    // creation of random building pasword for residents registration
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*&^%$#@!";
      const lengthOfCode = 10;
      let text = "";
      for (let i = 0; i < lengthOfCode; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }


  private createNewAdminUser(data, userId: string, buildingId: string){
    // set new user with admin property on webpage register
    let ref = this.db.collection('users')
    .doc(userId)

    return ref.set(data).then(()=>{
      // set additional user data
      ref.update({
        userId: userId,
        isAdmin: true,
        buildingId: buildingId
      }).then(()=>{          
          // relationate adminId with its specific building
          let buildingRef = this.db.collection('buildings')
            .doc(buildingId);

            buildingRef.update({
              adminId: userId
            })
        }) 
    }).catch(err =>{
      console.log(err);
    })
  }


  doormanCreationTrigger(buildingId: string, doormanData: any){
    // create firestore trigger to shot cloud functions which creates doorman account
    let ref = this.db.collection('buildings')
    .doc(buildingId)
    .collection('employees')

    return ref.add(doormanData)
    .then(docRef => {
      // update doorman node inside buildings document
      const doormanId = docRef.id;
      ref.doc(doormanId)
      .update({
        doormanId: doormanId,
        buildingId: buildingId
      })
      .then(()=>{
        // create doorman user in users node
        let refUsers = this.db.collection('users')
        .doc(doormanId)

        refUsers.set({
          name: doormanData.name,
          email: doormanData.email,
          isDoorman: true,
          buildingId: buildingId,
          userId: doormanId
        })
        .then(()=>console.log('doorman created in users node'))
        .catch(err => console.log(err))
    })
      .catch(err => console.log(err))
    })   
    .catch(err => console.log(err))
  }

  // END USER CREATION SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // CHATS AND COMUNICATIONS SERVICES

  createDefaultChatRoom(buildingId:string, buildingName:string, roomData:any, adminId:string){
    // creates building chats db ref and default chat room
    let ref = this.db.collection('chats')
    .doc(buildingId)

    return ref.set({
      buildingId: buildingId,
      buildingName: buildingName
    }).then(()=>{
      ref.collection('rooms')
      .add({
        roomName: roomData.roomName,
        roomDescription: roomData.roomDescription,
      }).then(docRef =>{
        const roomId = docRef.id;
        ref.collection('rooms')
        .doc(roomId)
        .update({
          roomId: roomId
        }).then(()=>{
          this.setChatRoomInfoInUser(adminId, roomId, roomData.roomName, roomData.roomDescription);
        })
      })
    })
  }


  createChatRoom(buildingId:string, roomData:any, userId:string, participants:Array<any>){
    // creates new Chat room
      let ref = this.db.collection('chats')
      .doc(buildingId)

      return ref.collection('rooms')
      .add({
        roomName: roomData.roomName,
        roomDescription: roomData.roomDescription,
      }).then(docRef =>{
        const roomId = docRef.id;
        ref.collection('rooms')
        .doc(roomId)
        .update({
          roomId: roomId
        }).then(()=>{
          // each participant is pushed into specific chat room
          participants.forEach((p)=>{
            if(p.property){
              ref.collection('rooms')
              .doc(roomId)
              .collection('participants')
              .doc(p.userId)
              .set({
                userId: p.userId,
                name: p.name,
                lastname: p.lastname,
                property: p.property
              }).then(()=>{
                // push room infor into user node
                this.setChatRoomInfoInUser(
                  p.userId,  
                  roomId, 
                  roomData.roomName, 
                  roomData.roomDescription
                )
              })
            }else{
              ref.collection('rooms')
              .doc(roomId)
              .collection('participants')
              .doc(p.userId)
              .set({
                userId: p.userId,
                name: p.name,
                lastname: p.lastname,
                property: p.job
              }).then(()=>{
                this.setChatRoomInfoInUser(
                  p.userId,  
                  roomId, 
                  roomData.roomName, 
                  roomData.roomDescription
                )
              })
            }
          })
        }).then(()=>{
          this.setChatRoomInfoInUser(userId, roomId, roomData.roomName, roomData.roomDescription);
        })
      })
    
  }


  private setChatRoomInfoInUser(userId, roomId, roomName, roomDescription){
    // link chat room to user participant or admin
    // (General/...(more default rooms to come)) is the default chat room an user is part of
    let refDefaultUserChatRoom = this.db.collection('users')
    .doc(userId)
    .collection('chatRooms')
    .doc(roomId)

    refDefaultUserChatRoom.set({
      roomId: roomId,
      roomName: roomName,
      roomDescription: roomDescription
    })
  }


  sendChatMessage(buildingId, roomId, messageData){
    // send chat message to firestore
    let ref = this.db.collection('chats')
    .doc(buildingId)
    .collection('rooms')
    .doc(roomId)
    .collection('messages')

    return ref.add({
      name: messageData.name,
      lastname: messageData.lastname,
      msg: messageData.msg,
      timestamp: messageData.timestamp,
      userId: messageData.userId
    })
  }
  sendPrivateChatMessage(chatId, messageData){
    // send privatechat message to firestore
    let ref = this.db.collection('privatechats')
    .doc(chatId)
    .collection('messages')

    return ref.add({
      name: messageData.name,
      lastname: messageData.lastname,
      msg: messageData.msg,
      timestamp: messageData.timestamp,
      userId: messageData.userId
    })
  }
  // END OF CHATS AND COMUNICATIONS SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // BOARD SERVICES

  createAnnouncement(buildingId:string, data:object){
    // update body or title of the announcement
    let ref = this.db.collection('board')
    .doc(buildingId)
    .collection('announcements')

    return ref.add(data)
    .then((docRef)=>{
      const announcementId = docRef.id;
      // update document with announcementId
      ref.doc(announcementId)
      .update({
        announcementId : announcementId
      });

      console.log('creation of announcement done');
      
    });
  }
  

  updateAnnouncement(buildingId:string, announcementId:string, data:object){
    // update body or title of the announcement
    let ref = this.db.collection('board')
    .doc(buildingId)
    .collection('announcements')
    .doc(announcementId)

    return ref.update(data)
    .then(()=>{
      console.log('announcement updated');
    }).catch(err => {
      console.log('an error happened: ' +err);
    });
  }
  
  // END OF BOARD SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  
}
