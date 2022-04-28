import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

//auth link 
{path:"**",component:AuthComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
