import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FecthDataService {
  constructor(private db: AngularFirestore) {
    
   }

  
 
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
    let ref = this.db.collection('payments_metadata')
    .doc('col_names')

    return ref.get();
  }
}
