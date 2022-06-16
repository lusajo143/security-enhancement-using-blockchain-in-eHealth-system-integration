import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { prescription } from 'src/app/interfaces/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public patient: any,
  ) { }

  prescription: any
  total = 0
  payment_status: string = "Not paid"

  closeSession(){

    Swal.fire({
      title: 'Do you want to end visit?',
      text:"Make sure that the patient has received medicine before ending visit",
      showCancelButton: true,
      confirmButtonText: 'End',
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.fire('closed!', '', 'success')
      } 
    })


  }
 
  ngOnInit(): void {
    
    this.prescription = this.patient.visits[this.patient.visits.length-1].prescription    

    this.prescription.forEach((p:any) => {
      this.total += parseInt(p.cost)
    });

  }

}
