import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatDialogComponent }    from './chat-dialog/chat-dialog.component';

const chatRoutes: Routes = [
     { path: 'chat',  component: ChatDialogComponent },
//   { path: 'hero/:id', component: HeroDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(chatRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRoutingModule { }