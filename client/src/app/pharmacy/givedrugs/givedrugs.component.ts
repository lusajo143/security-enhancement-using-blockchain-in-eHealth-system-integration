import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { calAge } from 'src/app/configs/config';
import { dataResponse } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import { ReceiptsComponent } from '../receipts/receipts.component';

@Component({
  selector: 'app-givedrugs',
  templateUrl: './givedrugs.component.html',
  styleUrls: ['./givedrugs.component.css']
})
export class GivedrugsComponent implements OnInit {

  constructor(
    private dialog:MatDialog,
    private service: FabricService,
    private snackbar: MatSnackBar
  ) { }



  showProgressBar =false
  showDataTable=true
  patients:any = []

 
    
  receipt(){

    const dialogRef = this.dialog.open(ReceiptsComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    
  }

  ngOnInit(): void {
    this.showProgressBar = true
    this.service.getPharmacyPatients().subscribe((result: any[]) => {
      this.showProgressBar = false
      for (let index = 0; index < result.length; index++) {
        result[index].dob = calAge(result[index].dob)
        this.patients.push(result[index])
      }
      this.patients =  result
      console.log(this.patients);
      
    })
  }


}
