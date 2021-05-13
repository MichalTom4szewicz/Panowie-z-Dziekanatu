import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import {EnrollmentForClassesComponent} from './components/enrollment-for-classes/enrollment-for-classes.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';

const routes: Routes = [
	{
		path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: HomeComponent
      },
      {
        path: '',
        canActivate: [AuthGuard],
        component: ToolbarComponent,
        children: [
          {
            path: 'plan',
            component: EnrollmentForClassesComponent
          },
          {
            path: 'supervisor',
            component: SupervisorComponent
          }
        ]
      },
    ]
	},
  {
    path: 'login',
    component: LoginComponent
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
