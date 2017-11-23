import { Component, OnInit,OnDestroy, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter  } from '@angular/core';
import { FormControl , FormGroup} from '@angular/forms';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { SpeechService } from '../../speech.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;
const recognition = webkitSpeechRecognition;

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit,OnDestroy {
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
  constructor(public chat: ChatService, public speech:SpeechService) { }

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
ngOnDestroy() {
  this.speech.DestroySpeechObject();
}
 onScroll() {
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
  speechData:any
  talk(){
    this.talking = !this.talking;
    if(this.talking){
     this.speechToTextStart(this.chat)
    }
  }


  
  speechToTextStart(chat) {

   let speechValue = new BehaviorSubject("");

   speechValue.subscribe((val) => {
     console.log("val",val);
    // if(val)
     //this.chat.converse(val,this.mute)
   })

    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    var recognition = new webkitSpeechRecognition();
    recognition.showInfo = function (s) {
      // this.update(new Message(s, 'user'));
     //this.chat.converse(s,this.mute)
    speechValue.next(s);
    }
   
     recognition.upgrade = function() {
      recognition.showInfo('info_upgrade');
     }
   
    recognition.continuous = true;
    recognition.interimResults = true;
    final_transcript = '';
    recognition.lang = 'en-US';

    recognition.onstart = function () {
      recognizing = true;
      recognition.showInfo('info_speak_now');
    };

    recognition.onresult = function (event) {
      console.log("speech event", event);
      var interim_transcript:any = '';
      if (typeof (event.results) == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        recognition.upgrade();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
           final_transcript  +=   event.results[i][0].transcript;
        } else {
           interim_transcript +=   event.results[i][0].transcript;
        }
        console.log("re",event.results[i][0].transcript)
      }
      //  final_transcript = recognition.capitalize(final_transcript);
      //  interim_transcript =  event.results[i][0].transcript;
      if (final_transcript || interim_transcript) {
        recognition.showInfo(final_transcript || interim_transcript);
      }

    };

    recognition.start();

    recognition.onend = function () {
      console.log("speech end", event);
      this.talking = false
      recognizing = false;
      if (ignore_onend) {
        return;
      }

      if (!final_transcript) {
        recognition.showInfo('info_start');
        return;
      }
      recognition.showInfo('');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    }
    recognition.onerror = function (event) {
      var start_timestamp;

      console.log("speech error", event);
      if (event.error == 'no-speech') {

        recognition.showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {

        recognition.showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          recognition.showInfo('info_blocked');
        } else {
          recognition.showInfo('info_denied');
        }
        ignore_onend = true;
      }
    }


  }

}
