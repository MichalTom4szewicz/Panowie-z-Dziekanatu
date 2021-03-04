import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthenticationService) {}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		if (this.authService.isAuthenticated()) {
			return true;
		}
		await this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
