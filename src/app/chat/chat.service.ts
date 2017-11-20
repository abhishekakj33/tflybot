import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content: string, public sentBy: string) { }
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;
const recognition = webkitSpeechRecognition;

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.tflybot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // Sends and receives messages via DialogFlow
  converse(msg: string, mute: boolean) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage, mute);
      }, (error) => {
        new Message('Not able to connect to server', 'bot');
      });
  }



  // Adds message to source
  update(msg: Message, mute?: boolean) {

    if (msg.sentBy == 'bot' && !mute) {
      let utterance = new SpeechSynthesisUtterance(msg.content);
      var voices = window.speechSynthesis.getVoices();
      utterance.onstart = function (event) {
        //console.log('The utterance started to be spoken.')
      };
      utterance.voice = voices.filter(function (voice) { return voice.name == 'Alex'; })[0];

      window.speechSynthesis.speak(utterance);
    }

    this.conversation.next([msg]);
  }

  

}


