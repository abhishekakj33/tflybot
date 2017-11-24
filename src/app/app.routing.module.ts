import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';



const appRoutes: Routes = [
  { path: '',   redirectTo: '/chat', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
  },
  {
    path: 'login',
    loadChildren: 'app/auth/auth.module#AuthModule',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}