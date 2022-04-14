import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { recoverPublicKey } from 'ethers/lib/utils';
import { AuthComponent } from './auth/auth/auth.component';
import { NewpatientComponent } from './reception/newpatient/newpatient.component';
import { ReceptionDashboardComponent } from './reception/reception-dashboard/reception-dashboard.component';
import { ReceptionComponent } from './reception/reception/reception.component';
import { SearchpatientComponent } from './reception/searchpatient/searchpatient.component';

const routes: Routes = [
 {path:"",component:AuthComponent},

 {path:"reception",component:ReceptionComponent,children:
 [
  {path:"dashboard",component:ReceptionDashboardComponent},
  {path:"addpatient",component:NewpatientComponent},
  {path:"findpatient",component:SearchpatientComponent},
   
 ]
}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
