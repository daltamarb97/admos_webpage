import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FecthDataService {

  constructor(private db: AngularFirestore) {
    
   }


   getUserInfo(userId){
    // get user profile info
    let ref = this.db.collection('users')
    .doc(userId)

    return ref.valueChanges();
  }


  // BUIDLING SERVICES

  getBuildingInfo(buildingId){
    // get building info
    let ref = this.db.collection('buildings')
    .doc(buildingId)

    return ref.valueChanges();
  }


  getBuidlingResidents(buildingId){
    // get building residents
    let ref = this.db.collection('buildings')
    .doc(buildingId)
    .collection('residents')

    return ref.stateChanges(['added']);
  }


  getBuidlingEmployees(buildingId){
    // get building employees (use in profile) 
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
    return this.db.collection('payment_tables')
    .doc(buildingId)
    .collection('rows_data')
    .valueChanges();
  }


  getColumnNames(){
    // get metadata of table payments
    let ref = this.db.collection('payments_metadata')
    .doc('col_names')

    return ref.get();
  }


  getSingleUserPaymentRecords(rowId){
    // get payment record of specific row in user detail's view after click on admin's table of payments
    let ref = this.db.collection('payments_records')
    .doc(rowId)
    .collection('record_of_payments')

    return ref.valueChanges();
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

  // BOARD SERVICES
    
  getBoardAnnouncements(buildingId){
    // get all the announcements for a building
    let ref = this.db.collection('board')
    .doc(buildingId)
    .collection('announcements', ref => ref.orderBy('timestamp', 'desc'))
    
    return ref.valueChanges();
  }

  // END OF BOARD SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*
}
