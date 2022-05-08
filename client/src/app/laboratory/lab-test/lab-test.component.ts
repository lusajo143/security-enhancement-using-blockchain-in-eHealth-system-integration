import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { create, IPFSHTTPClient } from 'ipfs-http-client'
import { simpleResponse, test } from 'src/app/interfaces/interfaces';
import { FabricService } from 'src/app/services/fabric.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lab-test',
  templateUrl: './lab-test.component.html',
  styleUrls: ['./lab-test.component.css']
})
export class LabTestComponent implements OnInit {

  tests: test[] = []

  client: IPFSHTTPClient = create({
    url: '/ip4/127.0.0.1/tcp/5001'
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FabricService,
    private snackbar: MatSnackBar,
  ) { }

  selectedFiles: FileList[] = []
  feedback: string[] = []
  imageUrl: string[] = []

  selectFile(event: any, index: any) {
    console.log(index);
    // this.selectedFiles[index] = event.target.files
    let cid = this.client.add(event.target.files[0])
          cid.then((result) => {
            this.imageUrl[index] = "http://127.0.0.1:8080/ipfs/" + result.path
          }).catch((err) => {
            console.log("An error occured");
          })

    // if (this.selectedFiles.length - 1 <= index) {
    //   this.selectedFiles[index] = event.target.files
    //   console.log("Updated");

    // } else {
    //   this.selectedFiles.push(event.target.files[0])
    //   console.log("Inserted new");
    // }

  }

  save(values: any) {

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {

      if (result.isConfirmed) {

        // Upload image to ipfs
        // for (let index = 0; index < this.feedback.length; index++) {
        //   let cid = this.client.add(this.selectedFiles[index][0])
        //   cid.then((result) => {
        //     this.imageUrl[index] = "http://127.0.0.1:8080/ipfs/" + result.path
        //   }).catch((err) => {
        //     console.log("An error occured");
        //   })
        // }

        // Prepare data to send to server
        this.data.visit.examination.clinicalDetails = values.clinicalDetails
        this.data.visit.examination.labTestComment = values.labTechComment

        for (let index = 0; index < this.tests.length; index++) {
          this.tests[index].image = this.imageUrl[index]
          this.tests[index].feedback = this.feedback[index]
        }

        this.data.visit.examination.tests = this.tests

        console.log(this.data);

        this.service.addLabResults(this.data).subscribe((result: simpleResponse) => {
          if (result.status == 200) {
            Swal.fire('Saved!', '', 'success')
          }
          this.snackbar.open(result.message, 'close')
        })


        
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  changeUpdate(event: string, index: any) {
    this.feedback[index] = event
  }


  ngOnInit(): void {

    let testJson = JSON.parse(this.data.visit.examination.tests)

    for (let index = 0; index < testJson.length; index++) {
      this.tests.push({ Key: testJson[index].Key, image: '', feedback: '' })
      this.feedback.push('')
      this.imageUrl.push('')
    }
  }

}

