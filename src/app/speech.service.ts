import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { trim } from "lodash/trim";

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;
const recognition = webkitSpeechRecognition;


@Injectable()
export class SpeechService {
  speechRecognition: any;

  constructor(private zone: NgZone) {

  }
  record(): Observable<string> {
    return Observable.create(observer => {
      
      this.speechRecognition = new webkitSpeechRecognition();

      this.speechRecognition.continuous = true;
      //this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 1;
      this.speechRecognition.onresult = speech => {
        let term = "";
        if (speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log("Unrecognized result - Please try again");
            }
            else {
              //term = trim(transcript);
              console.log("Did you said? -> " + term + " , If not then say something else...");
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      }
      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
      console.log("Say something - We are listening !!!");
    });
  }

  DestroySpeechObject() {
    if (this.speechRecognition)
      this.speechRecognition.stop();
  }
}
