import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions, ConnectionBackend, Request, RequestOptionsArgs, Response } from '@angular/http';
import { BoardDialogComponent } from './authentication-zone/board-dialog/board-dialog.component';
import { AuthenticationZoneComponent } from './authentication-zone/authentication-zone.component';
import { BoardZoneComponent } from './board-zone/board-zone.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FacebookComponent } from './authentication-zone/facebook-login/facebook.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HadronHttp } from './generics/generics.interceptor';
import { BoardService } from './board-zone/board/board.service';
import { BoardNewDialogComponent } from './board-zone/board-new-dialog/board-new-dialog.component';
import { BoardListDialogComponent } from './board-zone/board-list-dialog/board-list-dialog.component';
import { TextDocumentNewDialogComponent } from './board-zone/text-document-new-dialog/text-document-new-dialog.component';
import { AuthenticationService } from './authentication-zone/app-authentication/authentication.service';
import { MaterialModule } from '@angular/material';
import { QuillModule } from 'ngx-quill';

export function hadronHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions) { return new HadronHttp(backend, defaultOptions); }

const appRoutes: Routes = [
  {
    path: 'login',
    component: AuthenticationZoneComponent
  },
  {
    path: 'board',
    component: BoardZoneComponent
  },
  { 
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    BoardDialogComponent,
    BoardNewDialogComponent,
    BoardListDialogComponent,
    TextDocumentNewDialogComponent,
    AuthenticationZoneComponent,
    BoardZoneComponent,
    AppComponent,
    FacebookComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    QuillModule,
    NgbModule.forRoot(),
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    BoardDialogComponent,
    BoardNewDialogComponent,
    BoardListDialogComponent,
    TextDocumentNewDialogComponent
  ],
  providers: [{
      provide: HadronHttp,
      useFactory: hadronHttpFactory,
      deps: [XHRBackend, RequestOptions]
  }, 
  BoardService,
  AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
