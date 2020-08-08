import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HoldDataService } from '../services/hold-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoGuard implements CanActivate {
  
  constructor(
    private holdService: HoldDataService,
    private router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.holdService.userInfo && this.holdService.buildingInfo) {
      return true;
    } else{
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 300);
    }
  }

  isUserInfo() {
    if (this.holdService.userInfo && this.holdService.buildingInfo) {
      return true;
    } else{
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 300);
    }
  }
  
}
