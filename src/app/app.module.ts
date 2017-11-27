import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import {  AngularFirestoreModule} from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!

import { AppComponent } from './app.component';
import { AsanasModule } from './asanas/asanas.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    TagInputModule, BrowserAnimationsModule,
    AppRoutingModule,
    ChatModule,
    AdminModule,
    AsanasModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
