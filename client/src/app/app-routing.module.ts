import { NgModule, QueryList } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDashboardComponent } from './accounts/account-dashboard/account-dashboard.component';
import { AccountProcesspaymentComponent } from './accounts/account-processpayment/account-processpayment.component';
import { AccountQueComponent } from './accounts/account-que/account-que.component';
import { AccountReceiptComponent } from './accounts/account-receipt/account-receipt.component';
import { AccountComponent } from './accounts/account/account.component';
import { AuthComponent } from './auth/auth/auth.component';
import { ConsDashboardComponent } from './consoltation/cons-dashboard/cons-dashboard.component';
import { ConsExamformComponent } from './consoltation/cons-examform/cons-examform.component';
import { ConsHistoryformComponent } from './consoltation/cons-historyform/cons-historyform.component';
import { ConsSearchpatientComponent } from './consoltation/cons-searchpatient/cons-searchpatient.component';
import { ConsoltationComponent } from './consoltation/consoltation/consoltation.component';
import { DiagoniseComponent } from './consoltation/diagonise/diagonise.component';
import { PrescribeComponent } from './consoltation/prescribe/prescribe.component';
import { LabDashboardComponent } from './laboratory/lab-dashboard/lab-dashboard.component';
import { LabTestsComponent } from './laboratory/lab-tests/lab-tests.component';
import { LaboratoryComponent } from './laboratory/laboratory/laboratory.component';
import { NewpatientComponent } from './reception/newpatient/newpatient.component';
import { ReceptionDashboardComponent } from './reception/reception-dashboard/reception-dashboard.component';
import { ReceptionComponent } from './reception/reception/reception.component';
import { SearchpatientComponent } from './reception/searchpatient/searchpatient.component';

const routes: Routes = [

  //Reception links
 {path:"reception",component:ReceptionComponent,children:
 [
  {path:"dashboard",component:ReceptionDashboardComponent},
  {path:"addpatient",component:NewpatientComponent},
  {path:"findpatient",component:SearchpatientComponent},
 ],
 
},

//consultation links
{path:"consult",component:ConsoltationComponent,children:[
  {path:"dashboard",component:ConsDashboardComponent},
  {path:"patients",component:ConsSearchpatientComponent},
  {path:"history",component:ConsHistoryformComponent},
  {path:"examine",component:ConsExamformComponent},
  {path:"diagonise",component:DiagoniseComponent},
  {path:"prescribe",component:PrescribeComponent},
]},
//laboratory links

{path:"lab",component:LaboratoryComponent,children:[
  {path:"dashboard",component:LabDashboardComponent},
  {path:"tests",component:LabTestsComponent},
 

]},
//Account links
{path:"account",component:AccountComponent,children:[
  {path:"dashboard",component:AccountDashboardComponent},
  {path:"processpayment",component:AccountProcesspaymentComponent},
  {path:"receipt",component:AccountReceiptComponent},
 
]},


//auth link 
{path:"**",component:AuthComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
