import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dataResponse, simpleResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FabricService {

  constructor(private http:HttpClient) { }
  base_url:any="http://localhost:5000/"
 
  AddPatient(data:any){ 
    return this.http.post<simpleResponse>(this.base_url+"reception/registerPatient",data)
  }

  getPatients() {
    return this.http.get<dataResponse>(this.base_url+'reception/getPatients')
  }

  updatePatientStatus(data: any) {
    return this.http.post<simpleResponse>(this.base_url+'reception/sendToConsultation', data)
  }


  // Consultation
  getPatientsConsultation() {
    return this.http.get<dataResponse>(this.base_url+'consultation/getPatients')
  } 

  sendToLab(data: any) {
    return this.http.post<simpleResponse>(this.base_url+"consultation/sendToLab", data)
  }


  // Lab
  getLabPatients() {
    return this.http.get<dataResponse>(this.base_url+'lab/getPatients')
  }

}
