import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { calAge } from 'src/app/configs/config';
import { FabricService } from 'src/app/services/fabric.service';

@Component({
  selector: 'app-cons-historyform',
  templateUrl: './cons-historyform.component.html',
  styleUrls: ['./cons-historyform.component.css']
})
export class ConsHistoryformComponent implements OnInit {

  patient_id: string = ""

  isLoading: boolean = true

  patient: any

  constructor(
    private activeRoute: ActivatedRoute,
    private service: FabricService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: any) => {
      this.patient_id = params.id
      this.service.getPatient({patient_id: this.patient_id}).subscribe((result: any) => {
        this.patient = result.data
        this.patient.dob = calAge(result.data.dob)
        console.log(this.patient);
        this.isLoading = false
      })
    })
  }

}
