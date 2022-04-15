import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-newpatient',
  templateUrl: './newpatient.component.html',
  styleUrls: ['./newpatient.component.css']
})
export class NewpatientComponent implements OnInit {

  campainTwo: FormGroup;

  constructor() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campainTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });

  }

  register(form:any){
  let input = form.value
  let fname=input.fname
  let mname=input.mname
  let lname=input.lname
  let nextkin=input.nofkn
  let nextofkinplace=input.nofkp
  let raltionship=input.nofkr
  let dob=input.dob

  }
  ngOnInit(): void {
  }

}
