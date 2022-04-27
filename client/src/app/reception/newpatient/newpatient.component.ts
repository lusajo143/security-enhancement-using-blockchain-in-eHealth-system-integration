import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { simpleResponse } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-newpatient',
  templateUrl: './newpatient.component.html',
  styleUrls: ['./newpatient.component.css']
})
export class NewpatientComponent implements OnInit {

  campainTwo: FormGroup;
  dob: string = ""

  constructor(private service: FabricService,
    private snackbar: MatSnackBar) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campainTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });

  }

  register(form: NgForm) {
    let input = form.value
    let fname = input.fname
    let mname = input.mname
    let lname = input.lname
    let kinName = input.kinName
    let gender = input.gender
    let kinPlace = input.kinPlace
    let relationship = input.relationship
    let dob = input.dob
    let kinphone = input.kinPhone
    let phone = input.phone

    this.updateDOB(input.dob)

    let data = { fname, mname, lname, gender, kinName, kinPlace, relationship, dob, kinphone, phone }
    console.log(data);
    
    this.service.AddPatient(data).subscribe((result: simpleResponse) => {
      this.snackbar.open(result.message, "close")
      if (result.status == 200) {
        form.reset()
      }
    })
  }

  updateDOB(Date: string) {
    // convert object to string then trim it to yyyy-mm-dd
    // const dob = Date.split(' ')
    console.log(Date);
    
  }
  ngOnInit(): void {
  }

}
