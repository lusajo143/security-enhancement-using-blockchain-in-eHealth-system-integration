import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dataResponse, patient } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import {MatDialog} from '@angular/material/dialog'
import { PaymentmodalComponent } from '../paymentmodal/paymentmodal.component';

@Component({
  selector: 'app-searchpatient',
  templateUrl: './searchpatient.component.html',
  styleUrls: ['./searchpatient.component.css']
})
export class SearchpatientComponent implements OnInit {

  constructor(
    private service: FabricService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  patients: patient[] = []

  openDialog() {
   this.dialog.open(PaymentmodalComponent);
  }

  ngOnInit(): void {
    
    this.service.getPatients().subscribe((result: dataResponse) => {
      if (result.status == 200) {
        console.log(result.data);
        
        let data = JSON.parse(result.data)
        for (let index = 0; index < data.length; index++) {
          this.patients.push(data[index])
        }
      } else {
        this.snackbar.open(result.data)
      }
    })
  }

}
