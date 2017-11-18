import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter  } from '@angular/core';
import { FormControl , FormGroup} from '@angular/forms';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';


@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {
  @Output() seeHaro  = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messages: Observable<Message[]>;
  chatForm = new FormGroup ({
    userMsg: new FormControl()
  });
  talking:boolean = false;
  mute:boolean = false;
  disableScrollDown = false;
  userTextAvailability = false;
  volSupport = true;
  speechRecog = true
  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );

    this.chatForm.controls['userMsg'].valueChanges.subscribe(txt => {
      if(txt){
        this.userTextAvailability = true;
      }else{
        this.userTextAvailability = false;
      }
    })    
    this.chat.conversation.subscribe(msg => {
      if(msg.length > 0){
        this.seeHaro.emit("hi")
      }
    })

    // this.messages.subscribe(msg => {
    //   //msg[msg.length].content == 'want to see you'
    //   if(msg.length > 0){
    //     this.seeHaro.emit(true)
    //   }
    // })

    if ('speechSynthesis' in window) {
      // You're good to go!
      this.volSupport = true;
    } else {
      // Ah man, speech synthesis isn't supported.
      this.volSupport = false;
    }
    if ('webkitSpeechRecognition' in window) {
       //this.upgrade();
       this.speechRecog = true;
    } else {
      this.speechRecog = false;
    }
        
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
    if(this.chatForm.controls['userMsg'].value == '' || this.chatForm.controls['userMsg'].value == undefined || this.chatForm.controls['userMsg'].value == null || this.chatForm.controls['userMsg'].value.length == 0) return
    this.chat.converse(this.chatForm.controls['userMsg'].value,this.mute);
    this.chatForm.get('userMsg').setValue('');
  }

 
  muted(){
    this.mute = !this.mute;
  }

  talk(){
    this.talking = !this.talking;
    if(this.talking){
      this.chat.speechToTextStart()
    }
  }

}
