import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions, ConnectionBackend, Request, RequestOptionsArgs, Response } from '@angular/http';
//import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { FacebookComponent } from './facebook-login/facebook.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HadronHttp } from './generics/generics.interceptor';

export function hadronHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions) { return new HadronHttp(backend, defaultOptions); }

@NgModule({
  declarations: [
    AppComponent,
    FacebookComponent
  ],
  imports: [
   // MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [{
      provide: HadronHttp,
      useFactory: hadronHttpFactory,
      deps: [XHRBackend, RequestOptions]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
