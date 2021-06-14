import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { isBefore } from 'date-fns';
import { UnitsConstants } from '../../constants/units-constants';
import { CommunicationConstants } from '../../constants/communication-constants';
import { UserRole } from '../../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private static readonly CREATE_ACCOUNT_URL = CommunicationConstants.getFullAuthApiAddress('/user');
  private static readonly AUTHENTICATE_URL = CommunicationConstants.getFullAuthApiAddress('/authenticate');

  constructor(private readonly http: HttpClient) {}

  private static decodeToken(): any {
    const token = LocalStorageService.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return '';
  }

  public static hasRole(role: UserRole): boolean {
    const decodedToken = AuthenticationService.decodeToken();
    return decodedToken && decodedToken.role.name === role;
  }

  public static getUsername(): string {
    const token = AuthenticationService.decodeToken();
    return token && token.username
      ? token.username
      : undefined;
  }

  public isAuthenticated(): boolean {
    const decodedToken = AuthenticationService.decodeToken();
    if (decodedToken) {
      const expirationDate = decodedToken.exp * UnitsConstants.MILLISECONDS_IN_SECOND;
      if (isBefore(Date.now(), expirationDate)) {
        return true;
      }
    }
    this.logOut();
    return false;
  }

  public setToken(token: string): void {
    LocalStorageService.setToken(token);
  }

  public logOut(): void {
    LocalStorageService.removeToken();
  }

  public logIn(username: string, password: string): Observable<string | null> {
    return this.http.post(AuthenticationService.AUTHENTICATE_URL, {
        username, password
      }).pipe(map((tokenResponse: any) => {
        return tokenResponse.success && tokenResponse.token
          ? tokenResponse.token
          : null;
      }));
  }

  public createAccount(username: string, password: string, role?: string): Observable<boolean> {
    const newRole = role || 'USER';
    return this.http.post(AuthenticationService.CREATE_ACCOUNT_URL, {
      user: { username, password, role: newRole }
    }).pipe(map((serviceResponse: any) => !!serviceResponse.success));
  }
}
