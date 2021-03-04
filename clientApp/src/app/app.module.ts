import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
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

const socketIoConfig: SocketIoConfig = {
	url: 'http://localhost:3000',
	options: {},
};

@NgModule({
	declarations: [AppComponent, HomeComponent, LoginComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SocketIoModule.forRoot(socketIoConfig),
		BrowserAnimationsModule,
		MatCardModule,
		MatFormFieldModule,
		FlexLayoutModule,
		ReactiveFormsModule,
		FormsModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
