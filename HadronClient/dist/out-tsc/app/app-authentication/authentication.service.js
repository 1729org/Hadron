var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AuthenticationConstants } from './authentication.constants';
import { GenericConstants } from '../generics/generics.constants';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../generics/generics.interceptor';
import { Tools } from '../generics/generics.tools';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var AuthenticationService = (function () {
    function AuthenticationService(hadronHttp) {
        this.hadronHttp = hadronHttp;
    }
    AuthenticationService.prototype.authenticate = function (email) {
        var authHeader = new Headers();
        authHeader.append('Authorization', btoa(email));
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + AuthenticationConstants.LOGIN_URL, {
            headers: authHeader
        })
            .map(function (response) {
            var body = response.json();
            return body.data || {};
        })
            .map(Tools.mapToBoard)
            .catch(function (error) {
            console.log(error.status);
            return Observable.throw(error);
        });
    };
    AuthenticationService.prototype.isAuthenticated = function () {
        return localStorage.getItem('x-auth-token') != null;
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HadronHttp])
], AuthenticationService);
export { AuthenticationService };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/app-authentication/authentication.service.js.map