import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AsanasListComponent }    from './components/asanas-list/asanas-list.component';

const asanasRoutes: Routes = [
     { path: '',  component: AsanasListComponent },
//   { path: 'hero/:id', component: HeroDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(asanasRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AsanasRoutingModule { }