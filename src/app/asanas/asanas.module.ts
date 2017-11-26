import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{AsanasRoutingModule} from  './asanas.routing.module';
import { AsanasListComponent } from './components/asanas-list/asanas-list.component';

@NgModule({
  imports: [
    CommonModule,
    AsanasRoutingModule
  ],
  declarations: [AsanasListComponent]
})
export class AsanasModule { }
