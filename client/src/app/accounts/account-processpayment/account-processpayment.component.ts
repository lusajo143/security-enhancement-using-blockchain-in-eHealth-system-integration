import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-processpayment',
  templateUrl: './account-processpayment.component.html',
  styleUrls: ['./account-processpayment.component.css']
})
export class AccountProcesspaymentComponent implements OnInit {

  showProgressBar =true
  showDataTable=true
 
  constructor() { }


  insurance(){
    Swal.fire({
      title: 'Do you want to pay by cash?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Payment hass bee settled succeffuly!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Payment terminated', '', 'info')
      }
    })

  }

  ngOnInit(): void {
  }

}
