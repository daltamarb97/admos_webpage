import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { HoldDataService } from '../../core/services/hold-data.service';


@Component({
  selector: 'app-user-table-profile',
  templateUrl: './user-table-profile.component.html',
  styleUrls: ['./user-table-profile.component.scss']
})
export class UserTableProfileComponent implements OnInit {

  rowInfo:object;

  constructor(
    private _location: Location,
    // services 
    private holdData: HoldDataService
  ) { }

  ngOnInit(): void {
    this.rowInfo = this.holdData.userInfoInRow;
    console.log(this.rowInfo);  
  }


  goBackToDashboard(){
    this._location.back();
  }

}
