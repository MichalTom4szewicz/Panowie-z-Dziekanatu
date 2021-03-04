import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'clientApp';

  constructor(/*public chatService: ChatService*/) {}

  ngOnInit() {
    // this.chatService.sendMessage("DUPA")
  }
}
