import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { barChart } from '../../charts/barChart'

@Component({
  selector: 'app-reception-dashboard',
  templateUrl: './reception-dashboard.component.html',
  styleUrls: ['./reception-dashboard.component.css']
})
export class ReceptionDashboardComponent implements OnInit {

  constructor() { }
  barChart = new Chart(barChart);

  ngOnInit(): void {

  }

}
