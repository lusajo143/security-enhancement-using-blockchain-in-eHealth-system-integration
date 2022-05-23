import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { simpleResponse } from 'src/app/interfaces/interfaces';
import { FabricService } from '../../services/fabric.service'
import { baseUrl } from '../../configs/config'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router,
    private service: FabricService) { }


  login(form: any) {
    let input = form.value
    let username = input.username
    let password = input.password

    //  if(username=="reception" && password=="reception"){
    //   this.router.navigate(["/reception/dashboard"])
    //  }
    //  else if(username=="consult" && password=="consult"){
    //   this.router.navigate(["/consult/dashboard"]) 
    //  }

    //  else if(username == "lab" && password=="lab"){
    //   this.router.navigate(["/lab/dashboard"]) 
    //  }


    this.service.enrollUser({ userId: username, userSecret: password }).subscribe((results: simpleResponse) => {
      if (results.status == 200) {
        window.open(`${baseUrl}download-id/${username}`, '_blank')
        if (username == "receptionist1") {
          this.router.navigate(["/reception/dashboard"])
        }
        else if (username == "doctor1") {
          this.router.navigate(["/consult/dashboard"])
        }

        else if (username == "technician1") {
          this.router.navigate(["/lab/dashboard"])
        }
      }
    })


  }
  ngOnInit(): void {
  }

}
