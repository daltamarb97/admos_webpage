import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatDialog} from '@angular/material';
import { Router } from '@angular/router';

import { FecthDataService } from '../core/services/fecth-data.service';
import { SetDataService } from '../core/services/set-data.service';

import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as XLSX from 'xlsx';

import { DialogOverviewComponent } from './../material-component/dialog/dialog.component'
import { DeleteDataService } from '../core/services/delete-data.service';
import { AuthService } from '../core/services/auth.service';
import { HoldDataService } from '../core/services/hold-data.service';






@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
     
    destroy$: Subject<void> = new Subject()
    file:any;
    arrayBuffer:any;
    filelist = [];
    dayList: number[] = [1, 2, 3, 4, 5, 6, 7, 
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, 31];
    firebaseDay:number;
    showSpinner:boolean = false;
    userId: string;
    user:any;  // userInfo variable

    constructor(
      // services
      private fetchData: FecthDataService,
      private setData: SetDataService,
      private deleteData: DeleteDataService,
      private authService: AuthService,
      private holdData: HoldDataService,
      // UI components
      public dialog: MatDialog,
      private router: Router
    ){ 
      this.getColumnNames();
    }

    
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource([]);


    ngOnInit() {
      this.authService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.userId = user.uid; 
        this.getUserInfo();
      });
    }


    ngOnDestroy(){
      this.destroy$.next();
      console.log('me destrui');
    }


    private getColumnNames(){
      // get column names dynamically
      this.fetchData.getColumnNames().subscribe((data)=>{
        let obj = data.data()
        Object.getOwnPropertyNames(obj).forEach((col)=>{
          this.displayedColumns.push(obj[col]);
        })
      })
    }


    private getUserInfo(){
      // get user Info to be used
      this.fetchData.getUserInfo(this.userId)
      .subscribe(user=>{
        this.user = user.data();
        // assign userInfo value to global variable
        this.authService.userInfo = this.user;
        // Execute functions that rely on userInfo data 
        this.getCurrentPaymentDay();
        this.getInitialTableData(); 
      })
    }


    private getInitialTableData(){
      // get current table data on init
      this.fetchData.getTableData(
        this.user.activeBuilding,
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {  
        console.log('me active');

        this.dataSource.data = data
      })
    }


    private getCurrentPaymentDay(){
      // get current payment day from firebase
      this.fetchData.getPaymentDay(this.user.activeBuilding)
      .subscribe((day)=>{
        let paymentDay = day.data().payment_day;
        this.firebaseDay = paymentDay;
      })
    }


    addfile(event){   
      // Excel reader logic 
      this.file= event.target.files[0];     
      let fileReader = new FileReader();    
      fileReader.readAsArrayBuffer(this.file);     
      fileReader.onload = (e) => {    
          this.arrayBuffer = fileReader.result;    
          var data = new Uint8Array(this.arrayBuffer);    
          var arr = new Array();    
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
          var bstr = arr.join("");    
          var workbook = XLSX.read(bstr, {type:"binary"});    
          var first_sheet_name = workbook.SheetNames[0];    
          var worksheet = workbook.Sheets[first_sheet_name];    
          console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
          var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
          this.filelist = arraylist; 
          
          // set read data to firebase 
          for(let row of this.filelist){
            this.setData.setTableData(this.user.activeBuilding, row)
            .then(()=>{
              console.log('data in firebase');
              
            })
          }
        } 
      }

    

    openDialog(action, obj){
      obj.action = action;
      const dialogRef = this.dialog.open(DialogOverviewComponent,{
        data: obj
      });

      dialogRef.afterClosed().subscribe(result =>{
        if(result.event === 'Cancel'){
          // do nothing
        }else if(result.event === 'Update'){
          this.updateRowData(result.data);
        }else if(result.event === 'Delete'){
          this.deleteRowData(result.data);
        }else if(result.event === 'Add'){
          this.setRowData(result.data);
        }else if(result.event === 'Payment'){ 
          const data = {
            pending_to_pay: parseInt(obj.pending_to_pay) - parseInt(result.data.payment),
            rowId: result.data.rowId,
          }
          this.updatePendingToPay(data);
        }
      })
    }


    showUserRowProfile(row){
      this.holdData.userInfoInRow = row;
      this.router.navigate(['/tabla-pagos/', row.rowId])
    }


    private updateRowData(data){
      // update firebase info for that specific row
      this.setData.updateSingleRow(this.user.activeBuilding, data.rowId, data)
    }


    private updatePendingToPay(data){
      // update firebase info for that specific row
      this.setData.updatePendingToPay(this.user.activeBuilding, data.rowId, data.pending_to_pay)      
    }


    private deleteRowData(data){
      // delete data of specific row from firebase
      this.deleteData.deleteSingleTableRow(this.user.activeBuilding, data.rowId)
    }


    private setRowData(data){
      // Set row data manually
      this.setData.setTableData(this.user.activeBuilding, data)
    }


    setNewPaymentDay(event){
      // set/update payment day
      this.setData.setPaymentDay(this.user.activeBuilding, event.value);
    }

    
    sendPaymentRemainderEmail(data){
      // send automatic reminder email by event
      this.showSpinner = true;
      this.setData.setFirestoreTriggerPaymentEmail(this.user.activeBuilding, data.rowId);
      setTimeout(() => {
        this.showSpinner = false;
        console.log('deberia desaparecer el spinner');
      }, 3000); 
    }

}

