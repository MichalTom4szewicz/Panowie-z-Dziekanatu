import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../services/auth/authentication.service';

@Directive({
  selector: '[pzdHasRole]'
})
export class HasRoleDirective extends NgIf {
  @Input() set pzdHasRole(role: any) {
    this.ngIf = this.authService.hasRole(role);
  }

  constructor(private authService: AuthenticationService, viewContainer: ViewContainerRef, templateRef: TemplateRef<any>) {
    super(viewContainer, templateRef);
  }
}
