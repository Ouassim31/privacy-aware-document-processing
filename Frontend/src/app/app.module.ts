import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandlordRequestFormComponent } from './landlord-request-form/landlord-request-form.component';
import { ApplicantResponseFormComponent } from './applicant-response-form/applicant-response-form.component';
import { BasicPageComponent } from './basic-page/basic-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LandlordRequestFormComponent,
    ApplicantResponseFormComponent,
    BasicPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
