import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree} from '@angular/router';

import { HoldDataService } from '../services/hold-data.service';
import { FecthDataService } from '../services/fecth-data.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserinfoGuard implements CanActivate {
  constructor(
    private holdData: HoldDataService,
    private fetchData: FecthDataService,
    private authService: AuthService,
  ) {} 
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    console.log('me estoy ejecutando');
    if (!this.holdData.userId || !this.holdData.userInfo || !this.holdData.buildingInfo){
      try {
        await this.getBuildingInfo();
        return true;
      }catch (error) {
        console.error(error);
        return false;
      }
    }else {
      return true;
    }
  }

  private getData() {
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser()
      .subscribe(user => {
        if(user) {
          this.holdData.userId = user.uid; 
          resolve(this.holdData.userId); 
        }
        reject('current user not found')
      });
    })
  }

  private async getUserInfo(){
    // get user Info to be used
    const userId = await this.getData();
    console.log(userId);
    
    return new Promise((resolve, reject) => {
      this.fetchData.getUserInfo(userId)
        .subscribe(user=>{
          if(user) {
            // assign userInfo value to global variable
            this.holdData.userInfo = user;
            resolve(this.holdData.userInfo)
          }
          reject('userInfo not found')
      })
    })
    
  }

  private async getBuildingInfo(){
    const userInfo:any = await this.getUserInfo();
    return new Promise((resolve, reject) => {
      // get building Info to be used
      this.fetchData.getBuildingInfo(userInfo.buildingId)
      .subscribe(building => {
        if(building) {
          // assign buildinginfo value to global variable
          this.holdData.buildingInfo = building;  
          this.holdData.hideSpinner = true;
          resolve(this.holdData.buildingInfo);
        } 
        reject('building info not found');
      })
    })
  }
}
