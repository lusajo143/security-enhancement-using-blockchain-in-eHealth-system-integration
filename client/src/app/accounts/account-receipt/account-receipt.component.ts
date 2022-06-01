import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dataResponse, Medicine, patientFull, prescription } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-account-receipt',
  templateUrl: './account-receipt.component.html',
  styleUrls: ['./account-receipt.component.css']
})
export class AccountReceiptComponent implements OnInit {

  patient_id: string = ""
  total: number = 0
  patient_data: patientFull = {
    id: '',
    dob: '',
    fname: '',
    mname: '',
    lname: '',
    plocation: '',
    gender: '',
    kinName: '',
    kinPhone: '',
    kinPlace: '',
    phone: '',
    relationship: '',
    visits: []
  }
  medicines: any = []
  constructor(
    private router: ActivatedRoute,
    private service: FabricService
  ) {
    
   }

  printReceipt(){
    Swal.fire({
      title: 'Have the patient paid?',
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
    this.router.params.subscribe((data)=>{
      this.service.getPatient({patient_id: JSON.parse(JSON.stringify(data)).pid.split("\"")[1]}).subscribe((result: dataResponse) => {
        if (result.status == 200) {
          this.patient_data = result.data
          this.medicines = this.patient_data.visits[0].prescription
          this.service.getDrugs().subscribe((drugs: dataResponse) => {
            let Drugs = drugs.data
            this.medicines.forEach((medicine: any) => {
              Drugs.forEach((drug: any) => {
                medicine.price = drug.price
              });
              this.total += parseInt(medicine.cost)
            });
            
          })
        }
      })
    })
  }

}
