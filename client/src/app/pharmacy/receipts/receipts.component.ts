import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {

  constructor() { }

  closeSession(){

    Swal.fire({
      title: 'Do you want to save close the session?',
      showDenyButton: true,
      text:"Make sure that the patient has received medics before closing the session",
      showCancelButton: true,
      confirmButtonText: 'close',
      denyButtonText: `Don't close`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('closed!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })


  }
 
  ngOnInit(): void {
  }

}
