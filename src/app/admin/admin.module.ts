import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { AsanasComponent } from './components/asanas/asanas.component';

import { AdminRoutingModule } from './admin.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [AsanasComponent]
})
export class AdminModule { }
