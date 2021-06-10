import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core'; 

import { ClassesComponent } from './components/common/classes/classes.component';
import { ClassGridDayComponent } from './components/enrollment-for-classes/class-grid-day/class-grid-day.component';
import { EnrollmentForClassesComponent } from './components/enrollment-for-classes/enrollment-for-classes.component';
import { CreateClassesScheduleComponent } from './components/enrollment-for-classes/create-classes-schedule/create-classes-schedule.component';
import { ReplaceClassesDialogComponent } from './components/enrollment-for-classes/class-grid-day/replace-classes-dialog/replace-classes-dialog.component';

import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SavedSchedulesComponent } from './components/enrollment-for-classes/create-classes-schedule/saved-schedules/saved-schedules.component';
import { SaveScheduleDialogComponent } from './components/enrollment-for-classes/create-classes-schedule/save-schedule-dialog/save-schedule-dialog.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { SupervisorClassesListComponent } from './components/supervisor/supervisor-classes-list/supervisor-classes-list.component';
import { ManageCoursesDialogComponent } from './components/supervisor/manage-courses-dialog/manage-courses-dialog.component';
import { ManageClassesDialogComponent } from './components/supervisor/supervisor-classes-list/manage-classes-dialog/manage-classes-dialog.component';
import { HostingRequestsDialogComponent } from './components/supervisor/supervisor-classes-list/hosting-requests-dialog/hosting-requests-dialog.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { ClassesOverviewComponent } from './components/classes-overview/classes-overview.component';
import { ClassesScheduleComponent } from './components/common/classes-schedule/classes-schedule.component';
import { ClassesDetailsDialogComponent } from './components/common/classes/classes-details-dialog/classes-details-dialog.component';
import { ClassesContentComponent } from './components/common/classes/classes-content/classes-content.component';
@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		LoginComponent,
		ClassesComponent,
		ClassGridDayComponent,
		EnrollmentForClassesComponent,
		CreateClassesScheduleComponent,
		ReplaceClassesDialogComponent,
		PageNotFoundComponent,
		ToolbarComponent,
		SavedSchedulesComponent,
		SaveScheduleDialogComponent,
		SupervisorComponent,
		SupervisorClassesListComponent,
		ManageCoursesDialogComponent,
		ManageClassesDialogComponent,
		HostingRequestsDialogComponent,
		ClassesOverviewComponent,
		ClassesScheduleComponent,
		CreateUserComponent,
		CreateUserComponent,
		HasRoleDirective,
		ClassesDetailsDialogComponent,
		ClassesContentComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatFormFieldModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatGridListModule,
		MatDialogModule,
		HttpClientModule,
		MatToolbarModule,
		MatBottomSheetModule,
		MatListModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTableModule,
		MatSelectModule,
		MatRippleModule
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
}
