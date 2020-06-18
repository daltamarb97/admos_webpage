import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

// services
import { FecthDataService } from '../../core/services/fecth-data.service';
import { AuthService } from '../../core/services/auth.service';

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
    // services
    private fetchData: FecthDataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if(this.authService.userInfo){
      this.user = this.authService.userInfo;
      this.getAnnouncements();
    }else{
      this.getUserId();
    }
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
    this.fetchData.getBoardAnnouncements(this.user.activeBuilding)
    .subscribe((announcements)=>{
      announcements.map(a => {
        const announce = a.payload.doc.data();
        this.announcementList.push(announce);
      });
    })


  }


  viewAnnouncementBody(item){
    item.action = 'view'
    console.log(item);
    
     
    const dialogRef = this.dialog.open(BoardDialogComponent,{
      data: item
    });
  }

}
