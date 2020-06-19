import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeleteDataService {

  constructor(private db: AngularFirestore) { }

  // PAYMENTS TABLE SERVICES

  deleteSingleTableRow(buildingId, rowId){
    // delete single specific row of payments table
    let ref = this.db.collection('payment_tables/')
    .doc(buildingId)
    .collection('rows_data')
    .doc(rowId)

    return ref.delete().then(()=>{
      console.log('removed successfully');
    })
  }

  // END PAYMENTS TABLE SERVICES

  // --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

  // COMUNICATIONS AND CHAT

  deleteChatRoom(buildingId, roomId, userId){
    // delete chat room in chats collection
    let ref  = this.db.collection('chats')
    .doc(buildingId)
    .collection('rooms')
    .doc(roomId)

    return ref.delete().then(()=>{
      // remove chat room info from user collection
      this.deleteChatRoomFromUser(userId, roomId);
    })
  }


  private deleteChatRoomFromUser(userId, roomId){
    // remove chat room info from user collection
    let ref = this.db.collection('users')
    .doc(userId)
    .collection('chatRooms')
    .doc(roomId)

    return ref.delete().then(()=>{
      console.log(' chat removed successfully');
    })
  }


// END OF COMUNICATIONS AND CHAT

// --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

// BOARD SERVICES

  deleteAnnouncement(buildingId:string, announcementId:string){
    // update body or title of the announcement
    let ref = this.db.collection('board')
    .doc(buildingId)
    .collection('announcements')
    .doc(announcementId)

    return ref.delete()
    .then(()=>{
      console.log('announcement deleted');
    }).catch(err => {
      console.log('an error happened: ' +err);
    });
  }


// END OF BOARD SERVICES

// --*--*--*--*--*--*--*--*--*--*--*--*--*--*--*

}
