import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LabTestComponent } from '../lab-test/lab-test.component';

@Component({
  selector: 'app-lab-tests',
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit {

  constructor(private dialog:MatDialog) { }


  testDialog() {
    const dialogRef = this.dialog.open(LabTestComponent );
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



  ngOnInit(): void {
  }

}
