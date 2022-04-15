import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { FabricService } from 'src/app/services/fabric.service';

@Component({
  selector: 'app-newpatient',
  templateUrl: './newpatient.component.html',
  styleUrls: ['./newpatient.component.css']
})
export class NewpatientComponent implements OnInit {

  campainTwo: FormGroup;

  constructor(private service:FabricService) {
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
  let ralationship=input.nofkr
  let dob=input.dob
  let kinphone=input.nofkp
  let patientphone=input.phone
  //Data structure
  let data={fname,mname,lname,nextkin,nextofkinplace,ralationship,dob,kinphone,patientphone}
  this.service.AddPatient(data)
  }
  ngOnInit(): void {
  }

}
