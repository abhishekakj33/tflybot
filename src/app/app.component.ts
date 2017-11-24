import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  haro = true;
  seeHaro(e){
    //console.log("e",e)
    this.haro = true;
  }
}
