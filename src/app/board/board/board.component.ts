import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

// services
import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';
import { SetDataService } from '../../core/services/set-data.service';
import { DeleteDataService } from '../../core/services/delete-data.service';
import { HoldDataService } from '../../core/services/hold-data.service';


// dialog material
import { BoardDialogComponent } from '../../material-component/board-dialog/board-dialog.component';





@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  destroy$:  Subject<void> = new Subject();

  userId:string;
  user:any; // variable for user info
  announcementList: Array<any> = []; // array of announcements used in the html
  constructor(
    public dialog: MatDialog,
    private router: Router,
    // services
    private fetchData: FecthDataService,
    private authService: AuthService,
    private setData: SetDataService,
    private deleteData: DeleteDataService,
    private holdData: HoldDataService
  ) { }

  ngOnInit(): void {
    if(this.authService.userInfo){
      this.user = this.authService.userInfo;
      this.getAnnouncements();
    }else{
      this.getUserId();
    }
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }


  private getUserId(){
    // get userId and then calls getUserInfo function
    this.authService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.userId = user.uid; 
        this.getUserInfo();
      });
  }


  private getUserInfo(){
    // get user Info to be used
    this.fetchData.getUserInfo(this.userId)
    .subscribe(user=>{
      this.user = user.data();
      // assign userInfo value to global variable
      this.authService.userInfo = this.user;
      // functions that rely on userInfo
      this.getAnnouncements();
    })
  }


  private getAnnouncements(){
    // get announcements of building
    this.announcementList = [];
    this.fetchData.getBoardAnnouncements(this.user.activeBuilding)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((announcements)=>{
      announcements.map(a => {
        const announce = a.payload.doc.data();
        this.announcementList.push(announce);
      });
    });
  }


  creationAnnouncement(){
    // create a new announcement
    const data = {
      action: 'create'
    };
    const dialogRef = this.dialog.open(BoardDialogComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      const event = result.event;
      if(event === 'create'){
        const resultData = {
          title: result.data.title,
          body: result.data.body,
          timestamp: this.holdData.convertJSDateIntoFirestoreTimestamp()
        };
        this.createAnnouncement(resultData);
      }
    })
  }


  viewAnnouncementBody(item, i){
    item.action = 'view';
    const index = i;
    const dialogRef = this.dialog.open(BoardDialogComponent,{
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      const event = result.event;
      if(event === 'edit'){
        const resultData = {
          announcementId: item.announcementId,
          title: result.data.title,
          body: result.data.body,
          timestamp: result.data.timestamp
        };
        this.updateAnnouncement(item, resultData);
        this.getAnnouncements();
      }else if(event === 'delete'){
        this.deleteAnnouncement(item);
        this.getAnnouncements();
      }
    })
  }


  private updateAnnouncement(item, data){
    // edition of announcement
    this.setData.updateAnnouncement(this.user.activeBuilding, item.announcementId, data);
  }


  private deleteAnnouncement(item){
    // elimination of announcement
    this.deleteData.deleteAnnouncement(this.user.activeBuilding, item.announcementId);
  }


  private createAnnouncement(data){
    // creation of new announcement
    this.setData.createAnnouncement(this.user.activeBuilding, data)
    .then(()=>{
      window.location.reload();
    })
  }

}
