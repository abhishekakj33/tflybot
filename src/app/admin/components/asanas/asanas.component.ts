import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { AuthService } from '../../../core/services/auth/auth.service';
//import { PollService } from '../../../core/services/poll/poll.service';
import { Asana, AsanaSteps, AsanaOption } from '../../../core/models/asana.model';

@Component({
  selector: 'asanas',
  templateUrl: './asanas.component.html',
  styleUrls: ['./asanas.component.css']
})
export class AsanasComponent implements OnInit {
  public asanasCollection: AngularFirestoreCollection<any>;
  asanas: Observable<any[]>;
  user: any;
  public submitted: boolean; // keep track on whether form is submitted
  asana: Observable<any>;
  asanaForm: FormGroup;


  constructor(public afs: AngularFirestore, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.asanasCollection = afs.collection<any>('asanas');
    this.asanas = this.asanasCollection.valueChanges();
  }


  ngOnInit() {


    this.createAsanaForm()

  }

  createAsanaForm(asana?: Asana): void {

    let sanskritName = asana ? asana.sanskritName : '',
      englishName = asana ? asana.englishName : '',
      about = asana ? asana.about : ''

    let benefits: FormArray = this.fb.array([]);
    let anatomies: FormArray = this.fb.array([]);
    let steps: FormArray = this.fb.array([]);
    let ailments: FormArray = this.fb.array([]);
    let contraindications: FormArray = this.fb.array([]);
    
    let options: FormArray = this.fb.array([]);

    this.asanaForm = this.fb.group({
      sanskritName: sanskritName,
      englishName: englishName,
      about: about,
      steps: steps,
      ailments: ailments,
      contraindications:contraindications,
      benefits: benefits,
      anatomies: anatomies
    });

    if (!asana) {
      this.addAnatomy();
      this.addStep();
      this.addAilment();
      this.addBenefit();
      this.addC();
    }


  }


  get steps(): FormArray {
    return this.asanaForm.get('steps') as FormArray;
  };

  initStep(step) {
    return this.fb.group({
      step: [step]
    });
  }


  addStep(steps?: any) {
    let step = steps ? steps.step : ''
    this.steps.push(this.initStep(step));
  }
  stepFocussed(stepIndex, noOfOptions) {
    if (stepIndex == (noOfOptions - 1)) {
      this.addStep(stepIndex)
    }
  }
  removeStep(i) {
    this.steps.removeAt(i);
  }




  get benefits(): FormArray {
    return this.asanaForm.get('benefits') as FormArray;
  };

  initBenefit(benefit) {
    return this.fb.group({
      benefit: [benefit]
    });
  }


  addBenefit(benefits?: any) {
    let benefit = benefits ? benefits.benefit : ''
    this.benefits.push(this.initBenefit(benefit));
  }
  benefitFocussed(index, noOfOptions) {
    if (index == (noOfOptions - 1)) {
      this.addBenefit(index)
    }
  }
  removeBenefit(i) {
    this.benefits.removeAt(i);
  }






  get ailments(): FormArray {
    return this.asanaForm.get('ailments') as FormArray;
  };

  initAilment(ailment) {
    return this.fb.group({
      ailment: [ailment]
    });
  }


  addAilment(ailments?: any) {
    let ailment = ailments ? ailments.ailment : ''
    this.ailments.push(this.initAilment(ailment));
  }
  ailmentFocussed(ailmentIndex, noOfOptions) {
    if (ailmentIndex == (noOfOptions - 1)) {
      this.addAilment(ailmentIndex)
    }
  }
  removeAilment(i) {
    this.ailments.removeAt(i);
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
  anatomyFocussed(anatomyIndex, noOfOptions) {
    if (anatomyIndex == (noOfOptions - 1)) {
      this.addAnatomy(anatomyIndex)
    }
  }
  removeAnatomy(i) {
    this.anatomies.removeAt(i);
  }
  
  get contraindications(): FormArray {
    return this.asanaForm.get('contraindications') as FormArray;
  };

  initC(contraindication) {
    return this.fb.group({
      contraindication: [contraindication]
    });
  }


  addC(contraindications?: any) {
    let contraindication = contraindications ? contraindications.anatomy : ''
    this.contraindications.push(this.initC(contraindication));
  }
  cFocussed(ndex, noOfOptions) {
    if (ndex == (noOfOptions - 1)) {
      this.addC(ndex)
    }
  }
  removeC(i) {
    this.contraindications.removeAt(i);
  }


  saveAsanaEvent(asana: Asana, isValid: boolean) {
   // if (!isValid) return;

   // this.submitted = true;
    // asana.authorUID = this.user.uid;
    // asana.author = this.user.displayName;
    // asana.authorImageUrl = this.user.photoURL
    asana.anatomiesTags = {};
    asana.anatomies.forEach(element => {
      asana.anatomiesTags[element.anatomy] = true
    });
    
    asana.ailmentsTags = {};
    asana.ailments.forEach(element => {
      asana.ailmentsTags[element.ailment] = true
    });
    asana.contraindicationsTags = {}
    asana.contraindications.forEach(element => {
      asana.contraindicationsTags[element.contraindication] = true
    });
    
    this.asanasCollection.add(asana);


  }
  deleteAsana(asana: Asana) {

  }
  ngOnDestroy() {
    //this.redirectToEdit.unsubscribe();
  }

}
