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

import { ClassesComponent } from './components/enrollment-for-classes/classes/classes.component';
import { ClassGridDayComponent } from './components/enrollment-for-classes/class-grid-day/class-grid-day.component';
import { EnrollmentForClassesComponent } from './components/enrollment-for-classes/enrollment-for-classes.component';
import { ClassesScheduleComponent } from './components/enrollment-for-classes/classes-schedule/classes-schedule.component';
import { ReplaceClassesDialogComponent } from './components/enrollment-for-classes/class-grid-day/replace-classes-dialog/replace-classes-dialog.component';

@NgModule({
	declarations: [AppComponent, HomeComponent, LoginComponent, ClassesComponent, ClassGridDayComponent, EnrollmentForClassesComponent, ClassesScheduleComponent, ReplaceClassesDialogComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatFormFieldModule,
		FlexLayoutModule,
		ReactiveFormsModule,
		FormsModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatGridListModule,
		MatDialogModule
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
