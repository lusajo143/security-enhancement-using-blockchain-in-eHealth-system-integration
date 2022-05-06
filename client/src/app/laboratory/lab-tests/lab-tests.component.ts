import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dataResponse, patientFull } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import { LabTestComponent } from '../lab-test/lab-test.component';

@Component({
  selector: 'app-lab-tests',
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit {

  constructor(private dialog:MatDialog,
    private service: FabricService) { }

  patients: patientFull[] = []
  
  testDialog() {
    const dialogRef = this.dialog.open(LabTestComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



  // TODO: add payment to visits
  ngOnInit(): void {
    this.service.getLabPatients().subscribe((result:dataResponse) => {
      if (result.status == 200) {
        console.log(result.data);
        
        for(let index = 0; index < result.data.length; index++) {
          this.patients.push(result.data[index])
        }
      } else {
        alert('Error occured')
      }
    })
  }

}
