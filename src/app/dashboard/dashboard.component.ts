import { Component, OnInit } from '@angular/core';
import {
  MatTableDataSource, 
  MatDialog, 
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar
} from '@angular/material';
import { Router } from '@angular/router';

import { FecthDataService } from '../core/services/fecth-data.service';
import { SetDataService } from '../core/services/set-data.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as XLSX from 'xlsx';

import { DialogOverviewComponent } from './../material-component/dialog/dialog.component'
import { DeleteDataService } from '../core/services/delete-data.service';
import { HoldDataService } from '../core/services/hold-data.service';
import { ExcelDialogComponent } from '../material-component/excel-dialog/excel-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
     
    destroy$: Subject<void> = new Subject();
    file:any;
    arrayBuffer:any;
    filelist = [];
    buildingId: string;
    // snackbar variables
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    constructor(
      // services
      private fetchData: FecthDataService,
      private setData: SetDataService,
      private deleteData: DeleteDataService,
      // private authService: AuthService,
      private holdData: HoldDataService,
      // UI components
      public dialog: MatDialog,
      private router: Router,
      private _snackBar: MatSnackBar,
    ){ 
      this.getColumnNames();
    }

    // table variables
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource([]);


    ngOnInit() {
      this.buildingId = this.holdData.userInfo.buildingId;
      this.getInitialTableData();
    }


    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
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


    private getInitialTableData(){
      // get current table data on init
      this.fetchData.getTableData(
        this.buildingId,
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {  
        console.log('me active');
        this.dataSource.data = data;
      });     
    }

    styleRow(row){
      if (row.pullRequest) {
        return {'background-color': '#F6F3A5'};
      }else if (row.pending_to_pay > row.amount_to_pay) {
        return {'background-color': '#F2D0D0'};
      }else{
        return {'background-color': 'white'};
      }
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
          this.setData.setTableData(this.buildingId, row)
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
          };

          const paymentData = {
            paid_amount: result.data.payment,
            timestamp: this.holdData.convertJSDateIntoFirestoreTimestamp(),
            author: 'admin'
          };

          this.updatePendingToPay(data, paymentData);
        }
      })
    }


  // openDialogForExcel(action, obj){
  //   // excel dialog
  //   obj.action = action;
  //   const dialogRef = this.dialog.open(ExcelDialogComponent,{
  //     data: obj
  //   });

  //   // dialogRef.afterClosed().subscribe(result =>{
  //   //   if(result.event === 'Cancel'){
  //   //     // do nothing
  //   //   }else if(result.event === 'Update'){
  //   //     this.updateRowData(result.data);
  //   //   }else if(result.event === 'Delete'){
  //   //     this.deleteRowData(result.data);
  //   //   }else if(result.event === 'Add'){
  //   //     this.setRowData(result.data);
  //   //   }else if(result.event === 'Payment'){ 
  //   //     const data = {
  //   //       pending_to_pay: parseInt(obj.pending_to_pay) - parseInt(result.data.payment),
  //   //       rowId: result.data.rowId,
  //   //     };

  //   //     const paymentData = {
  //   //       paid_amount: result.data.payment,
  //   //       timestamp: this.holdData.convertJSDateIntoFirestoreTimestamp(),
  //   //       author: 'admin'
  //   //     };

  //   //     this.updatePendingToPay(data, paymentData);
  //   //   }
  //   // })
  // }


    showUserRowProfile(row){
      this.holdData.userInfoInRow = row;
      this.router.navigate(['/tabla-pagos/', row.rowId])
    }


    private updateRowData(data){
      // update firebase info for that specific row
      this.setData.updateSingleRow(this.buildingId, data.rowId, data)
    }


    private updatePendingToPay(data, paymentData){
      // update firebase info for that specific row
      this.setData.updatePendingToPay(this.buildingId, data.rowId, data.pending_to_pay, paymentData)      
    }


    private deleteRowData(data){
      // delete data of specific row from firebase
      this.deleteData.deleteSingleTableRow(this.buildingId, data.rowId)
    }


    private setRowData(data){
      // Set row data manually
      this.setData.setTableData(this.buildingId, data)
    }

    
    sendPaymentRemainderMessage(){
      // send automatic reminder message
      const dataSource = this.dataSource.data;
      const userIdsToCompare = [];
      dataSource.forEach(el => {
        if (el.pending_to_pay > el.amount_to_pay) {
          const dataToPush = {
            userId: el.userId,
            name:el.name,
            lastname: el.lastname,
          }
          userIdsToCompare.push(dataToPush);
        }
      });  

      // check if chat key already exists and send message
      this.fetchData.getPrivateMessageKeys(this.holdData.userId)
        .subscribe(data => {
          const result = data.docs;
          const ids = [];
          result.forEach (el => {
            const dataToPush = {
              userId: el.id,
              chatId: el.data().chatId
            }
            ids.push(dataToPush)
          });
           
          userIdsToCompare.forEach(j => {
            ids.forEach(user => {
              if (user.userId === j.userId) {
                const dataMessage = {
                  chatId: user.chatId,
                  messageData : {
                    message: 'Te recordamos que tienes un saldo pendiente por pagar correspondiente a la cuota administrativa de tu conjunto residencial. Si tienes alguna duda acércate a la administración. (Este es un mensaje automático)',
                    timestamp: this.holdData.convertJSDateIntoFirestoreTimestamp(),
                    userId: this.holdData.userId
                  }
                }
                const index = userIdsToCompare.indexOf(j);
                userIdsToCompare.splice(index, 1);
                this.setData.sendPrivateMessage(dataMessage).then(()=>console.log('todo sucedio normal'))
              }
            })
          })
          
          if (userIdsToCompare.length > 0) {
            // send message to people admin didn't have a previous chat with
            userIdsToCompare.forEach(i => {
              const randomChatId = this.holdData.createRandomId();
              const dataLocal = {
                // set key in sender (me)
                localUserId: this.holdData.userId,
                foreignUserId: i.userId,
                chatData: {
                  chatId: randomChatId,
                  name: i.name,
                  lastname: i.lastname,
                }
              }
              const dataForeign = {
                // set key in receiver (other)
                localUserId: i.userId,
                foreignUserId: this.holdData.userId,
                chatData: {
                  chatId: randomChatId,
                  name: this.holdData.userInfo.name,
                  lastname: this.holdData.userInfo.lastname,
                }
              }
              this.setData.setKeyOfPrivateChat(dataLocal);
              this.setData.setKeyOfPrivateChat(dataForeign)
                .then(() => {
                  // send the actual message after key creation
                  const dataMessage = {
                    chatId: randomChatId,
                    messageData : {
                      message: 'Te recordamos que tienes un saldo pendiente por pagar correspondiente a la cuota administrativa de tu conjunto residencial. Si tienes alguna duda acércate a la administración. (Este es un mensaje automático)',
                      timestamp: this.holdData.convertJSDateIntoFirestoreTimestamp(),
                      userId: this.holdData.userId
                    }
                  }
                  this.setData.sendPrivateMessage(dataMessage).then(()=>console.log('todo sucedio normal'))
                })
            })
          }
        })
        // approval snackbar
        this._snackBar.open('Mensajes Enviados Exitosamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        }); 
    }

}

