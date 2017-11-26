import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import  'rxjs/add/operator/scan';
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
export class ChatDialogComponent implements OnInit, OnDestroy {
  @Output() seeHaro = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messages: Observable<Message[]>;
  chatForm = new FormGroup({
    userMsg: new FormControl()
  });
  talking: boolean = false;
  mute: boolean = false;
  disableScrollDown = false;
  userTextAvailability = false;
  volSupport = true;
  speechRecog = true
  constructor(public chat: ChatService, public speech: SpeechService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .scan((acc, val) => acc.concat(val));

    this.chatForm.controls['userMsg'].valueChanges.subscribe(txt => {
      if (txt) {
        this.userTextAvailability = true;
      } else {
        this.userTextAvailability = false;
      }
    })
    this.chat.conversation.subscribe(msg => {
      if (msg.length > 0) {
        this.seeHaro.emit("hi")
      }
    })

    if ('speechSynthesis' in window) {
      this.volSupport = true;
    } else {
      // Ah man, speech synthesis isn't supported.
      this.volSupport = false;
    }
    if ('webkitSpeechRecognition' in window) {
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


  sendMessage() {
    if (this.chatForm.controls['userMsg'].value == '' || this.chatForm.controls['userMsg'].value == undefined || this.chatForm.controls['userMsg'].value == null || this.chatForm.controls['userMsg'].value.length == 0) return
    this.chat.converse(this.chatForm.controls['userMsg'].value, this.mute,false);
    this.chatForm.get('userMsg').setValue('');
  }


  muted() {
    this.mute = !this.mute;
  }
  speechData: any
  talk() {
    this.talking = !this.talking;
    if (this.talking) {
      this.speechToTextStart(this.chat)
    }
  }



  speechToTextStart(chat) {

    let speechValue = new BehaviorSubject("");

    speechValue.subscribe((val) => {
      console.log("val", val);

    if(val != ('info_blocked' || 'info_speak_now')){
      this.chatForm.get('userMsg').setValue(val);
      setTimeout(() => {
        this.chatForm.get('userMsg').setValue('');
      },2000);  
    }

    if(val)
    this.chat.converse(val,this.mute,true)
      
    })

    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    var recognition = new webkitSpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.showInfo = function (s) {
      speechValue.next(s);
    }

    recognition.onstart = function () {
      recognizing = true;
      recognition.showInfo('info_speak_now');
    };

    recognition.onresult = function (event) {
      var interim_transcript: any = '';
      if (typeof (event.results) == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        recognition.upgrade();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      if (final_transcript || interim_transcript) {
        recognition.showInfo(final_transcript || interim_transcript);
      }

    };

    recognition.start();

    recognition.onend = function () {
      this.talking = false
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      if (!final_transcript) {
        recognition.showInfo('info_start');
        return;
      }
    }

    recognition.onerror = function (event) {
      var start_timestamp;
      this.talking = false
      if (event.error == 'no-speech') {
        recognition.showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        recognition.showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
          recognition.showInfo('info_blocked');  
        ignore_onend = true;
      }
    }
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
    } catch (err) { }
  }

}
