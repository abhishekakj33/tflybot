import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content: string, public sentBy: string,public time: any,public asana:any) { }
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;
const recognition = webkitSpeechRecognition;

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.yogi;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // Sends and receives messages via DialogFlow
  converse(msg: string, mute: boolean, audio: boolean) {
    let time = new Date().getTime()
    const userMessage = new Message(msg, 'user',time,[]);
    if (msg == 'info_blocked') {
      const botMessage = new Message('Microphone has been blocked.', 'bot',time,[]);
      this.update(botMessage, false, audio,[]);
    } else if (msg == 'info_speak_now') {
      const botMessage = new Message('You can Speak with me now.', 'bot',time,[]);
      this.update(botMessage, false, audio,[]);
    }
    else {
      this.update(userMessage, false, audio,[]);
    }

    if (msg != 'info_blocked') {
      return this.client.textRequest(msg)
        .then(res => {
          console.log("res dialogflow",res)
          const speech = res.result.fulfillment.speech;
          const asana:any = res.result.fulfillment
          if(asana.messages[0]){
  if(asana.messages[0].payload){
            var steps =   asana.messages[0].payload.steps
          }else {
             steps =   []
          }

          }
        
          const botMessage = new Message(speech, 'bot',time,steps);
          if (audio) {
            this.update(botMessage, mute, audio,[]);
          } else {
            this.update(botMessage, mute, audio,[]);
          }
        }, (error) => {
          new Message('Not able to connect to server', 'bot',time,[]);
        });
    }
  }

  // Adds message to source
  update(msg: Message, mute: boolean, audio: boolean,asana:any) {

    if (msg.sentBy == 'bot' && !mute) {
      let utterance = new SpeechSynthesisUtterance(msg.content);
      var voices = window.speechSynthesis.getVoices();
      utterance.onstart = function (event) {
        //console.log('The utterance started to be spoken.')
      };
      utterance.voice = voices.filter(function (voice) { return voice.name == 'Alex'; })[0];

      window.speechSynthesis.speak(utterance);
    }
    if (audio) {

      this.conversation.next([msg]);

    } else {
      this.conversation.next([msg]);
    }

  }



}


