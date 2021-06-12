import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {UserDataService} from '../services/user-data/user-data.service';
import {AuthenticationService} from '../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataGuard implements CanActivate {
  constructor(private userDataService: UserDataService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const username = AuthenticationService.getUsername();
    if (username) {
      const userData = await this.userDataService.getUserData(username).toPromise();
      console.log(userData);
      if (userData && userData.status !== 'failure') {
        return true;
      } else {
        return this.router.navigate(['/editUser']);
      }
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
