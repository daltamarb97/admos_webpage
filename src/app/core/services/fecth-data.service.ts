import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FecthDataService {

  userInfo:object;
  
  constructor(private db: AngularFirestore) {
    
   }


   getUserInfo(userId){
    // get user profile info
    let ref = this.db.collection('users')
    .doc(userId)

    return ref.get();
  }

  // BUIDLING SERVICES

  getBuildingInfo(buildingId){
    // get building info
    let ref = this.db.collection('buildings')
    .doc(buildingId)

    return ref.get();
  }


  getBuidlingResidents(buildingId){
    // get building residents 
    let ref = this.db.collection('buildings')
    .doc(buildingId)
    .collection('residents')

    return ref.stateChanges(['added']);
  }


  getBuidlingEmployees(buildingId){
    // get building residents 
    let ref = this.db.collection('buildings')
    .doc(buildingId)
    .collection('employees')
    
    return ref.stateChanges(['added']);
  }

  // END BUIDLING SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // PAYMENT TABLE SERVICES

  getTableData(buildingId){
     // get payment table's data 
    return this.db.collection('payment_tables').doc(buildingId)
    .collection('rows_data').valueChanges();
  }


  getPaymentDay(buildingId){
    // get current payment day
    let ref = this.db.collection('buildings/')
    .doc(buildingId)

    return ref.get();
  }


  getColumnNames(){
    // get metadata of table payments
    let ref = this.db.collection('payments_metadata')
    .doc('col_names')

    return ref.get();
  }

  // END OF PAYMENT TABLE SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // CHATS AND COMUNICATIONS SERVICES



  getChatRooms(userId){
    // getting chatrooms info
    let ref = this.db.collection('users')
    .doc(userId)
    .collection('chatRooms')

    return ref.stateChanges(['added', 'removed']);
  }


  getMessagesFromSpecificRoom(buildingId, roomId){
    // get messages from specific room
    let ref = this.db.collection('chats')
    .doc(buildingId)
    .collection('rooms')
    .doc(roomId)
    .collection('messages')

    return ref.stateChanges(['added']);
  }


  getParticipantsFromSpecificRoom(buildingId, roomId){
    // get messages from specific room
    let ref = this.db.collection('chats')
    .doc(buildingId)
    .collection('rooms')
    .doc(roomId)
    .collection('participants')

    return ref.stateChanges(['added']);
  }

  // END OF CHATS AND COMUNICATIONS SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*


}
