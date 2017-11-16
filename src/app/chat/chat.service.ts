import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const {webkitSpeechRecognition} : IWindow = <IWindow>window;
const recognition = new webkitSpeechRecognition();

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.tflybot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage);
               },(error) => {
                new Message('Not able to connect to server', 'bot');
               });
  }



  // Adds message to source
  update(msg: Message) {
    console.log("msg",msg);
    if ('speechSynthesis' in window) {
      // You're good to go!
    } else {
        // Ah man, speech synthesis isn't supported.
    }
    if(msg.sentBy == 'bot'){
      let utterance = new SpeechSynthesisUtterance(msg.content);
      var voices = window.speechSynthesis.getVoices();
      utterance.onstart = function(event) {
        console.log('The utterance started to be spoken.')
    };
      utterance.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
      
      window.speechSynthesis.speak(utterance);
    }
    
    this.conversation.next([msg]);
  }

  speechToTextStart(){
   
    var create_email = false;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

  //   recognition.onstart = function() {
  //     recognizing = true;
  //     showInfo('info_speak_now');
  //     start_img.src = '/intl/en/chrome/assets/common/images/content/mic-animate.gif';
  //   };

  //   recognition.onresult = function(event) { 
  //     console.log("speech event",event) ;
  //     var interim_transcript = '';
  //     if (typeof(event.results) == 'undefined') {
  //       recognition.onend = null;
  //       recognition.stop();
  //       upgrade();
  //       return;
  //     }
  //     for (var i = event.resultIndex; i < event.results.length; ++i) {
  //       if (event.results[i].isFinal) {
  //         final_transcript += event.results[i][0].transcript;
  //       } else {
  //         interim_transcript += event.results[i][0].transcript;
  //       }
  //     }
  //     final_transcript = capitalize(final_transcript);
  //     final_span.innerHTML = linebreak(final_transcript);
  //     interim_span.innerHTML = linebreak(interim_transcript);
  //     if (final_transcript || interim_transcript) {
  //       showButtons('inline-block');
  //     }
  //   };
  //   }
  //   //final_transcript = '';
  //   recognition.lang = select_dialect.value;
  //   recognition.start();
  //   recognition.onerror = function(event) { 
  //     console.log("speech error",event) ;
  //     if (event.error == 'no-speech') {
  //       start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
  //       showInfo('info_no_speech');
  //       ignore_onend = true;
  //     }
  //     if (event.error == 'audio-capture') {
  //       start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
  //       showInfo('info_no_microphone');
  //       ignore_onend = true;
  //     }
  //     if (event.error == 'not-allowed') {
  //       if (event.timeStamp - start_timestamp < 100) {
  //         showInfo('info_blocked');
  //       } else {
  //         showInfo('info_denied');
  //       }
  //       ignore_onend = true;
  //     }
  //    }
  //   recognition.onend = function() {  
  //     console.log("speech end",event) ;
  //     recognizing = false;
  //     if (ignore_onend) {
  //       return;
  //     }
  //     start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
  //     if (!final_transcript) {
  //       showInfo('info_start');
  //       return;
  //     }
  //     showInfo('');
  //     if (window.getSelection) {
  //       window.getSelection().removeAllRanges();
  //       var range = document.createRange();
  //       range.selectNode(document.getElementById('final_span'));
  //       window.getSelection().addRange(range);
  //     }
  //     if (create_email) {
  //       create_email = false;
  //       createEmail();
  //     }
  //   }
  // }
  //  showInfo(s) {
  //   if (s) {
  //     for (var child = info.firstChild; child; child = child.nextSibling) {
  //       if (child.style) {
  //         child.style.display = child.id == s ? 'inline' : 'none';
  //       }
  //     }
  //     info.style.visibility = 'visible';
  //   } else {
  //     info.style.visibility = 'hidden';
  //   }
   }

}
