import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescribe',
  templateUrl: './prescribe.component.html',
  styleUrls: ['./prescribe.component.css']
})
export class PrescribeComponent implements OnInit {

  medicines =["asprin","panadol"]

  constructor() { }

  ngOnInit(): void {
  }

}
