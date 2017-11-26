import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { AuthService } from '../../../core/services/auth/auth.service';
//import { PollService } from '../../../core/services/poll/poll.service';
import { Asana , AsanaSteps, AsanaOption} from '../../../core/models/asana.model';

@Component({
  selector: 'asanas',
  templateUrl: './asanas.component.html',
  styleUrls: ['./asanas.component.css']
})
export class AsanasComponent implements OnInit {
  private asanasCollection: AngularFirestoreCollection<any>;
  asanas: Observable<any[]>;
  user: any;
  public submitted: boolean; // keep track on whether form is submitted
   asana: Observable<any>;
   asanaForm: FormGroup;
  

  constructor(private afs: AngularFirestore,private fb: FormBuilder,private router: Router, private route: ActivatedRoute) {
    this.asanasCollection = afs.collection<any>('items');
    this.asanas = this.asanasCollection.valueChanges();
  }


  ngOnInit() {
    

    this.createAsanaForm()

  }

  createAsanaForm(asana?: Asana): void {

    let sanskritName = asana ? asana.sanskritName : '',
    englishName = asana ? asana.englishName : '',
    about = asana ? asana.about : ''


    let anatomies: FormArray = this.fb.array([]);
    ////let steps: FormArray = this.fb.array([]);

    let options: FormArray = this.fb.array([]);

    this.asanaForm = this.fb.group({
      sanskritName: sanskritName,
      englishName:englishName,
      about:about,
    //  steps: steps,
      anatomies:anatomies
    });

     if (!asana) {
      this.addAnatomy();
     }
    

  }

  get anatomies(): FormArray {
    return this.asanaForm.get('anatomies') as FormArray;
  };

  initAnatomy(anatomy) {
    return this.fb.group({
      anatomy: [anatomy]
    });
  }


  addAnatomy(anatomies?: any) {
    let anatomy = anatomies ? anatomies.anatomy : ''
    this.anatomies.push(this.initAnatomy(anatomy));
  }
  anatomyFocussed(anatomyIndex,noOfOptions){
    if (anatomyIndex == (noOfOptions - 1)) {
    this.addAnatomy(anatomyIndex)
    }
  }
  removeAnatomy(i){
    this.anatomies.removeAt(i);
  }


  saveAsanaEvent(asana: Asana, isValid: boolean, state) {
    if(!isValid) return;
    
    this.submitted = true;
    asana.authorUID = this.user.uid;
    asana.author = this.user.displayName;
    asana.authorImageUrl = this.user.photoURL

    this.asanasCollection.add(asana);

  }
  deleteAsana(asana: Asana) {
   
  }
  ngOnDestroy() {
    //this.redirectToEdit.unsubscribe();
  }

}
