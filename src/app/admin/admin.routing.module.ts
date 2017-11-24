import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AsanasComponent }    from './components/asanas/asanas.component';

const adminRoutes: Routes = [
     { path: '',  component: AsanasComponent },
//   { path: 'hero/:id', component: HeroDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }