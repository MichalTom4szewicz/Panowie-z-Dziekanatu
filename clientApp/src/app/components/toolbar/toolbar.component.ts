import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {Router} from '@angular/router';
import {UserRole} from '../../enums/user-role.enum';

@Component({
  selector: 'pzd-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {

  constructor(private readonly _authService: AuthenticationService, private _router: Router) { }

  ngOnInit(): void {}

  async logOut(): Promise<void> {
    this._authService.logOut();
    await this._router.navigate(['login']);
  }

  isAdmin(): boolean {
    return AuthenticationService.hasRole(UserRole.GOD);
  }
}
