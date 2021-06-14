import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { EnrollmentForClassesComponent } from './components/enrollment-for-classes/enrollment-for-classes.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ClassesOverviewComponent } from './components/classes-overview/classes-overview.component';
import {EditUserDataComponent} from './components/edit-user-data/edit-user-data.component';
import {UserDataGuard} from './guards/user-data.guard';
import {BrowseUsersComponent} from './components/browse-users/browse-users.component';
import {AdminOnlyGuard} from './guards/admin-only.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, UserDataGuard],
    component: ToolbarComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard, UserDataGuard],
      },
      {
        path: 'plan',
        component: EnrollmentForClassesComponent,
        canActivate: [AuthGuard, UserDataGuard],
      },
      {
        path: 'supervisor',
        component: SupervisorComponent,
        canActivate: [AuthGuard, UserDataGuard],
      },
      {
        path: 'overview',
        component: ClassesOverviewComponent,
        canActivate: [AuthGuard, UserDataGuard],
      },
      {
        path: 'users',
        canActivate: [AuthGuard, UserDataGuard, AdminOnlyGuard],
        component: BrowseUsersComponent
      },
    ]
  },
  {
    path: 'editUser',
    component: EditUserDataComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: CreateUserComponent
  },

  {
    path: '**',
    component: PageNotFoundComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
