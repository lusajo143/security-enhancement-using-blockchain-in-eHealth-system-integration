import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReceiptsComponent } from '../receipts/receipts.component';

@Component({
  selector: 'app-givedrugs',
  templateUrl: './givedrugs.component.html',
  styleUrls: ['./givedrugs.component.css']
})
export class GivedrugsComponent implements OnInit {

  constructor(private dialog:MatDialog) { }
  showProgressBar =true
  showDataTable=true
  patients:any = []

 
    
  receipt(){

    const dialogRef = this.dialog.open(ReceiptsComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    
  }

  ngOnInit(): void {
  }


}
