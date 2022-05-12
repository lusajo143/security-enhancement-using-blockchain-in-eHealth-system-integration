import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router:Router) { }


   login(form:any){
   let input =form.value
   let username=input.username
   let password=input.password

   if(username=="reception" && password=="reception"){
    this.router.navigate(["/reception/dashboard"])
   }
   else if(username=="consult" && password=="consult"){
    this.router.navigate(["/consult/dashboard"]) 
   }

   else if(username == "lab" && password=="lab"){
    this.router.navigate(["/lab/dashboard"]) 
   }
 
   else if(username == "account" && password=="account"){
    this.router.navigate(["/account/dashboard"]) 
   }

   else if(username == "pharmacy" && password=="pharmacy"){
    this.router.navigate(["/pharmacy/dashboard"]) 
   }
   
     
   }
  ngOnInit(): void {
  }

}
