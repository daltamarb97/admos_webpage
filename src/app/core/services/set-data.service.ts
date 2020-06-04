import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SetDataService {

  constructor(private db: AngularFirestore) { }


  // PAYMENTS TABLE SERVICES

  setTableData(buildingId, data){
    // set data to a specific payment table using Excel
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')

    return ref.add(data).then((docRef)=>{
        ref.doc(docRef.id).update({
          rowId: docRef.id,
          manualEmail: false
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
      
    })
  }


  setPaymentDay(buildingId, paymentDay){
    // set or update payment day
    let ref = this.db.collection('buildings')
    .doc(buildingId)

    ref.update({
      payment_day: paymentDay
    }).then(()=>{
      console.log('payment day successfully updated');
      
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
        buildingId: buildingId
      }).then(()=>{
        // creates user with admin roperty 
        this.createNewAdminUser(adminData, adminId, buildingId);
        // creates default chatRoom for this building
        // General is the default chat room
        this.createChatRoom(
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


  private createNewAdminUser(data, userId, buildingId){
    // set new user with admin property on webpage register
    let ref = this.db.collection('users')
    .doc(userId)

    return ref.set(data).then(()=>{
      // set additional user data
      ref.update({
        userId: userId,
        isAdmin: true,
        activeBuilding: buildingId
      }).then(()=>{
        // set associated buildingId to that admin user
        ref.collection('buildings')
        .doc(buildingId)
        .set({
          buildingId: buildingId
        }).then(()=>{          
          // relationate adminId with its specific building
          let buildingRef = this.db.collection('buildings')
            .doc(buildingId);

            buildingRef.update({
              adminId: userId
            })
        })
      })
    }).catch(err =>{
      console.log(err);
      
    })
  }

  // END USER CREATION SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // CHATS AND COMUNICATIONS SERVICES

  createChatRoom(buildingId:string, buildingName:string, roomData:any, userId:string){
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
          this.setChatRoomInfoInUser(userId, roomId, roomData.roomName);
        })
      })
    })
  }


  private setChatRoomInfoInUser(userId, roomId, roomName){
    // link chat room to user
    // (General) is the default chat room an user is part of
    let refDefaultUserChatRoom = this.db.collection('users')
    .doc(userId)
    .collection('chatRooms')
    .doc(roomId)

    refDefaultUserChatRoom.set({
      roomId: roomId,
      roomName: roomName
    })
  }

  // END OF CHATS AND COMUNICATIONS SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*
  
}
