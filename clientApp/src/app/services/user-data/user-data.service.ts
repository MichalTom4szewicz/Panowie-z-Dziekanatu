import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommunicationConstants} from '../../constants/communication-constants';
import {Observable} from 'rxjs/internal/Observable';
import {User} from '../../domain/user';

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
    return this._http.get(UserDataService.USER_DATA_URL + `?username=${username}`);
  }

  public getAllUsersData(): Observable<User[]> {
    return this._http.get(UserDataService.USER_DATA_URL + '/all') as Observable<User[]>;
  }

  public getUserAccount(username: string): Observable<any> {
    return this._http.get(CommunicationConstants.getFullAuthApiAddress('/user/'.concat(username)));
  }

  public getAllUserAccounts(): Observable<any> {
    return this._http.get(CommunicationConstants.getFullAuthApiAddress('/users'));
  }

  public updateUserRole(username: string, role: string): Observable<any> {
    return this._http.put(
      CommunicationConstants.getFullAuthApiAddress('/role/update'),
      { username, role }
    );
  }

  public updateUserData(user: User): Observable<any> {
    return this._http.put(
      CommunicationConstants.getFullDataApiAddress(`/users?username=${user.username}`),
      { object: user }
    );
  }

  public deleteUserAccount(username: string): Observable<any> {
    return this._http.delete(
      CommunicationConstants.getFullAuthApiAddress(`/${username}`)
    );
  }

  public deleteUserData(username: string): Observable<any> {
    return this._http.delete(
      CommunicationConstants.getFullDataApiAddress(`/users?username=${username}`)
    );
  }
}
