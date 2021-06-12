import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommunicationConstants} from '../../constants/communication-constants';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private static readonly USER_DATA_URL = CommunicationConstants.getFullDataApiAddress('/users');

  constructor(private _http: HttpClient) { }

  public saveUserData(userData: any): Observable<any> {
    return this._http.post(UserDataService.USER_DATA_URL, userData);
  }

  public getUserData(username: string): Observable<any> {
    return this._http.get(UserDataService.USER_DATA_URL + '/' + username);
  }
}
