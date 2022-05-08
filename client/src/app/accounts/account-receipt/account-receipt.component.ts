import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-account-receipt',
  templateUrl: './account-receipt.component.html',
  styleUrls: ['./account-receipt.component.css']
})
export class AccountReceiptComponent implements OnInit {

  constructor() { }

  printReceipt(){
    Swal.fire({
      title: 'Do you want to print this receipt?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'yes',
      denyButtonText: `Don't print`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('printed!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('not printed', '', 'info')
      }
    })
  }

  ngOnInit(): void {
  }

}
