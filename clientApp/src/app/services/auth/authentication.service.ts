import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private tokenBehaviorSubject: BehaviorSubject<string>;

	constructor() {
		this.tokenBehaviorSubject = new BehaviorSubject<string>('');
	}

	public isAuthenticated(): boolean {
		return this.tokenBehaviorSubject.getValue() !== '';
	}

	public setToken(token: string) {
		LocalStorageService.setToken(token);
		this.tokenBehaviorSubject.next(token);
	}

	public logOut() {
		this.tokenBehaviorSubject.next('');
		LocalStorageService.removeToken();
	}

	public logIn(username: string, password: string): Observable<any> {
		console.log('Logging in as', username);
		this.tokenBehaviorSubject.next('token');
		LocalStorageService.setToken('token');
		return of('token');
	}
}
