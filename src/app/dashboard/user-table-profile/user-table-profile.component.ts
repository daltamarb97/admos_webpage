import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material';

import { HoldDataService } from '../../core/services/hold-data.service';
import { FecthDataService } from '../../core/services/fecth-data.service';

import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';



export interface PeriodicElement {
  name: string;
  position: number;
}


@Component({
  selector: 'app-user-table-profile',
  templateUrl: './user-table-profile.component.html',
  styleUrls: ['./user-table-profile.component.scss']
})
export class UserTableProfileComponent implements OnInit {

  rowInfo:any;
  showTable:boolean = false; // this variable allow UI to show table of payment records
  destroy$:  Subject<void> = new Subject()

  // record of payments table variables
  displayedColumns: string[] = ['paid_amount', 'timestamp', 'author'];
  dataSource = new MatTableDataSource([]);

  constructor(
    private _location: Location,
    // services 
    private holdData: HoldDataService,
    private fetchData: FecthDataService
  ) { }

  ngOnInit(): void {
    this.rowInfo = this.holdData.userInfoInRow;
    console.log(this.rowInfo);  
  }


  ngOnDestroy(){
    this.cancelTableSubscription();
  }


  cancelTableSubscription(){
    this.destroy$.next();
    this.destroy$.complete(); 
    console.log('ya no estoy');
  }


  goBackToDashboard(){
    this._location.back();
  }


  getPaymentRecords(){
    this.showTable = true; 
    // get payment records
    this.fetchData.getSingleUserPaymentRecords(this.rowInfo.rowId)
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      const dataArray = data;
      const finalArray = dataArray.map(e => {
        e.timestamp = e.timestamp.toDate();
        return e;
      });
      this.dataSource.data = finalArray;
    })
  }


  hideRecordTable(){
    this.showTable = false;
    this.cancelTableSubscription();
  }

}
