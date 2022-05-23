import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { barChart } from '../../charts/barChart'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  barChart = new Chart(barChart);


  ngOnInit(): void {
  }

}
