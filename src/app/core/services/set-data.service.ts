import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SetDataService {

  constructor(private db: AngularFirestore) { }


  
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
    let ref = this.db.collection('buildings/')
    .doc(buildingId)

    ref.set({
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
  
}
