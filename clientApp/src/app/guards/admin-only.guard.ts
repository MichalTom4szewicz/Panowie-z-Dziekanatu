import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/auth/authentication.service';
import {UserRole} from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminOnlyGuard implements CanActivate {
  constructor(private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (AuthenticationService.hasRole(UserRole.GOD)) {
      return true;
    } else {
      return this._router.navigate(['notFound']);
    }
  }
}
