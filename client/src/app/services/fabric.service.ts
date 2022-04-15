import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FabricService {

  constructor(private http:HttpClient) { }
  base_url:any="www.url.com"
 
  AddPatient(data:any){
    this.http.post(this.base_url,data)
    console.log("Data has been saved")
  }

}
