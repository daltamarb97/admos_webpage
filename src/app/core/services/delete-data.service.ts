import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeleteDataService {

  constructor(private db: AngularFirestore) { }


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
}
