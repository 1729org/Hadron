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
import { GenericConstants } from '../../generics/generics.constants';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { User } from '../../models/user';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var AuthenticationService = (function () {
    function AuthenticationService(hadronHttp) {
        this.hadronHttp = hadronHttp;
        this.jwtHelper = new JwtHelper;
        if (this.isAuthenticated()) {
            this.setClaims(localStorage.getItem('token'));
        }
    }
    AuthenticationService.prototype.authenticate = function (email) {
        var _this = this;
        var authHeader = new Headers();
        authHeader.append('Authorization', btoa(email));
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + AuthenticationConstants.LOGIN_URL, {
            headers: authHeader
        })
            .map(function (response) {
            var toReturn = [response.headers.get('x-auth-token') != null];
            var board = Tools.mapToBoard(response.json());
            _this.setClaims(response.headers.get('x-auth-token'));
            toReturn.push(board);
            return toReturn;
        })
            .catch(function (error) {
            error.authentication = [error.headers.get('x-auth-token') != null];
            return Observable.throw(error);
        });
    };
    AuthenticationService.prototype.isAuthenticated = function () {
        return localStorage.getItem('token') != null;
    };
    AuthenticationService.prototype.logout = function () {
        localStorage.removeItem('token');
    };
    AuthenticationService.prototype.setClaims = function (token) {
        var decoded = this.jwtHelper.decodeToken(token);
        this.user = new User(decoded.email, decoded.assignedUserColor);
    };
    AuthenticationService.prototype.getClaims = function () {
        return this.user;
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HadronHttp])
], AuthenticationService);
export { AuthenticationService };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/authentication-zone/app-authentication/authentication.service.js.map