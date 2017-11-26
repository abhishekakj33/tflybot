import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'asanas-list',
  templateUrl: './asanas-list.component.html',
  styleUrls: ['./asanas-list.component.css']
})
export class AsanasListComponent implements OnInit {
  asanas: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.asanas = db.collection('asanas').valueChanges();
  this.asanas.map((val) => {
    var  arrTheraputicApplications = []
    var  arrAnatomy = []
    val.forEach(element => {
      

      if(element.anatomy){
       
        arrAnatomy.push(this.getKeyByValue(element.anatomy,true))   
        element.arrAnatomyy = arrTheraputicApplications
      }
      if(element.theraputicApplications){
        arrTheraputicApplications.push(this.getKeyByValue(element.theraputicApplications,true))   
        element.theraputicApplicationss = arrTheraputicApplications
      }

    });
    console.log("val",val);
  
  }).subscribe();
  }
getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
  ngOnInit() {
  }
 
}
