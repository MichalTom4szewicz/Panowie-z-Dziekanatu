import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { fromUnixTime, isBefore } from 'date-fns';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	constructor(private readonly http: HttpClient) {}

	private static decodeToken(): any {
	  const token = LocalStorageService.getToken();
	  if (token) {
      return jwtDecode(token);
    }
	  return '';
  }

	public isAuthenticated(): boolean {
    const decodedToken = AuthenticationService.decodeToken();
    if (decodedToken) {
      const expirationDate = fromUnixTime(decodedToken.exp);
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
		return this.http.post('https://127.0.0.1:4848/authenticate', {
        username, password
      }).pipe(map((tokenResponse: any) => {
        return tokenResponse.success && tokenResponse.token
          ? tokenResponse.token
          : null;
      }));
	}
}
