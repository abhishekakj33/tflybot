import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
//import { AuthService } from '../../../core/services/auth/auth.service';
//import { PollService } from '../../../core/services/poll/poll.service';
import { Asana , AsanaSteps, AsanaOption} from '../../../core/models/asana.model';

@Component({
  selector: 'asanas',
  templateUrl: './asanas.component.html',
  styleUrls: ['./asanas.component.css']
})
export class AsanasComponent implements OnInit {

  constructor(private fb: FormBuilder,private router: Router, private route: ActivatedRoute) {
  }

 
   //redirectToEdit: Subscription;
  user: any;
  public submitted: boolean; // keep track on whether form is submitted
   asana: Observable<any>;
  // pollId: any;
   asanaForm: FormGroup;
  // dynamicHeight = true;
  // public formEvents: any[] = [];



  ngOnInit() {
    

    this.createAsanaForm()

  }

  createAsanaForm(asana?: Asana): void {

    let sanskritName = asana ? asana.sanskritName : '',
    englishName = asana ? asana.englishName : '',
    about = asana ? asana.about : ''


    let anatomies: FormArray = this.fb.array([]);
    let steps: FormArray = this.fb.array([]);

    let options: FormArray = this.fb.array([]);

    this.asanaForm = this.fb.group({
      sanskritName: sanskritName,
      englishName:englishName,
      about:about,
      steps: steps,
      anatomies:anatomies
    });

    if (!asana) {
      this.addStep();
      this.addAnatomy();
      this.addOption(0)
    } else {
      
    }

  }

  initStep(step) {
    let options: FormArray = this.fb.array([]);
    return this.fb.group({
      step: [step],
      options: options
    });
  }

  get steps(): FormArray {
    return this.asanaForm.get('steps') as FormArray;
  };


  addStep(steps?: AsanaSteps) {
    let step = steps ? steps.step : ''
    this.steps.push(this.initStep(step));
    this.addOption(this.steps.length - 1);
  }

  initOption(option) {
    return this.fb.group({
      option: [option]
    });
  }

  addOption(stepIndex?: number, asanaOpt?: AsanaOption) {
    //console.log("questionIndex", questionIndex)
    let option = asanaOpt ? asanaOpt.option : '';
    let options = this.steps.controls[stepIndex].get('options') as FormArray
    options.push(this.initOption(option))
  }

  removeStep(stepIndex: number) {
    //console.log("this.questions", this.questions, "this.poll", this.poll);
    this.steps.removeAt(stepIndex);
  }

  removeOption(stepIndex: number, optionIndex: number) {
    let options = this.steps.controls[stepIndex].get('options') as FormArray
    options.removeAt(optionIndex);
  }
  optionFocussed(stepIndex, optionIndex, noOfOptions) {
    if (optionIndex == (noOfOptions - 1)) {
      this.addOption(stepIndex)
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

    //this.pollServ.savePoll(poll);

    //this.router.navigate(['../polls'])
  }
  deleteAsana(asana: Asana) {
   
  }
  ngOnDestroy() {
    //this.redirectToEdit.unsubscribe();
  }

}
