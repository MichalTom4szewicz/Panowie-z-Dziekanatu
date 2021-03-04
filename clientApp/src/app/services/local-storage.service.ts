import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	constructor() {}

	private static setValue(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	private static getValue(key: string): string | null {
		return localStorage.getItem(key);
	}

	public static setToken(token: string) {
		LocalStorageService.setValue('token', token);
	}

	public static getToken(): string {
		return LocalStorageService.getValue('token') || '';
	}

	public static removeToken() {
		return LocalStorageService.setToken('');
	}
}
