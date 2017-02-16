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
//import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { FacebookComponent } from './facebook-login/facebook.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HadronHttp } from './generics/generics.interceptor';
export function hadronHttpFactory(backend, defaultOptions) { return new HadronHttp(backend, defaultOptions); }
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/app.module.js.map