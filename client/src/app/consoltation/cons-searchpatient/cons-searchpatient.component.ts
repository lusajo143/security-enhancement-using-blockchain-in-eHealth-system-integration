import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { dataResponse, patient } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import { ConsExamformComponent } from '../cons-examform/cons-examform.component';
import { DiagoniseComponent } from '../diagonise/diagonise.component';
import { PrescribeComponent } from '../prescribe/prescribe.component';

@Component({
  selector: 'app-cons-searchpatient',
  templateUrl: './cons-searchpatient.component.html',
  styleUrls: ['./cons-searchpatient.component.css']
})
export class ConsSearchpatientComponent implements OnInit {


  constructor(public dialog: MatDialog,
    private service: FabricService) {}
    showProgressBar=true
    showDataTable=false
    patients: patient[] = []

  openDiagonise() {
    const dialogRef = this.dialog.open(DiagoniseComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openExamine(){
    const dialogRef = this.dialog.open(ConsExamformComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }


  openPrescribe(){

    const dialogRef = this.dialog.open(PrescribeComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }


  ngOnInit(): void {

    this.service.getPatientsConsultation().subscribe((result: dataResponse) => {
      if (result.status == 200) {
        let data = JSON.parse(result.data)
        for (let index = 0; index < data.length; index++) {
          this.patients.push(data[index])
        }
      }

    })
  }
}



