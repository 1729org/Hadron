var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { BoardDialogComponent } from './authentication-zone/board-dialog/board-dialog.component';
import { AuthenticationZoneComponent } from './authentication-zone/authentication-zone.component';
import { BoardZoneComponent } from './board-zone/board-zone.component';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FacebookComponent } from './authentication-zone/facebook-login/facebook.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HadronHttp } from './generics/generics.interceptor';
import { BoardService } from './board-zone/board/board.service';
import { AuthenticationService } from './authentication-zone/app-authentication/authentication.service';
import { MaterialModule } from '@angular/material';
import { QuillModule } from 'ngx-quill';
export function hadronHttpFactory(backend, defaultOptions) { return new HadronHttp(backend, defaultOptions); }
var appRoutes = [
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
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            BoardDialogComponent,
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
            BoardDialogComponent
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
], AppModule);
export { AppModule };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/app.module.js.map