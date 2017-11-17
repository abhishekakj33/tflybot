import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';


@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messages: Observable<Message[]>;
  formValue: string;
  talking:boolean = false;
  mute:boolean = false;
  disableScrollDown = false
  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );
        
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
}

private onScroll() {
  let element = this.myScrollContainer.nativeElement
  let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
  if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
  } else {
      this.disableScrollDown = true
  }
}


private scrollToBottom(): void {
  if (this.disableScrollDown) {
      return
  }
  try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }
}

  sendMessage() {
    if(this.formValue == '' || this.formValue == undefined || this.formValue == null || this.formValue.length == 0) return
    this.chat.converse(this.formValue);
    this.formValue = '';
  }

  talk(){
    this.talking = !this.talking;
    if(this.talking){
      this.chat.speechToTextStart()
    }
  }
  muted(){
    this.mute = !this.mute;
  }

}
