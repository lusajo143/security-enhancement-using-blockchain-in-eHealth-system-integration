import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReceptionComponent } from './reception/reception/reception.component';
import { ReceptionDashboardComponent } from './reception/reception-dashboard/reception-dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ReceptionNavbarComponent } from './reception/reception-navbar/reception-navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ReceptionSidebarComponent } from './reception/reception-sidebar/reception-sidebar.component';
import {MatListModule} from '@angular/material/list';
import { NewpatientComponent } from './reception/newpatient/newpatient.component';
import { SearchpatientComponent } from './reception/searchpatient/searchpatient.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { DataTablesModule } from "angular-datatables";



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ReceptionComponent,
    ReceptionDashboardComponent,
    ReceptionNavbarComponent,
    ReceptionSidebarComponent,
    NewpatientComponent,
    SearchpatientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    DataTablesModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
