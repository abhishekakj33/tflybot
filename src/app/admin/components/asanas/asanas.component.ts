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

    let days = asana ? asana.days : 'five'

    let questions: FormArray = this.fb.array([]);

    let options: FormArray = this.fb.array([]);

    this.asanaForm = this.fb.group({
      days: days,
      questions: questions,
    });

    if (!asana) {
      this.addQuestion();
      this.addOption(0)
    } else {
      //console.log("in else",poll);
      // poll.questions.forEach((question, qindex) => {
      //   this.addQuestion(question);
      //   question.options.forEach((option, optindex) => {
      //     this.addOption(qindex, option)
      //   })
      // })
    }

  }

  initQuestion(question) {
    let options: FormArray = this.fb.array([]);
    return this.fb.group({
      question: [question],
      options: options
    });
  }

  get questions(): FormArray {
    return this.asanaForm.get('questions') as FormArray;
  };


  addQuestion(questions?: AsanaSteps) {
    let question = questions ? questions.question : ''
    this.questions.push(this.initQuestion(question));
    this.addOption(this.questions.length - 1);
  }
  /**
   * Adds a option FormGroup to the question <FormArray>FormControl
   * @method addOption
   * @param {questionIndex} index of the question to which option is to be added
   * @return {void}
   */
  initOption(option) {
    return this.fb.group({
      option: [option]
    });
  }

  addOption(questionIndex?: number, asanaOpt?: AsanaOption) {
    //console.log("questionIndex", questionIndex)
    let option = asanaOpt ? asanaOpt.option : '';
    let options = this.questions.controls[questionIndex].get('options') as FormArray
    options.push(this.initOption(option))
  }

  removeQuestion(questionIndex: number) {
    //console.log("this.questions", this.questions, "this.poll", this.poll);
    this.questions.removeAt(questionIndex);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    let options = this.questions.controls[questionIndex].get('options') as FormArray
    options.removeAt(optionIndex);
  }
  optionFocussed(questionIndex, optionIndex, noOfOptions) {
    if (optionIndex == (noOfOptions - 1)) {
      this.addOption(questionIndex)
    }

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
