var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { FacebookConstants } from './facebook.constants';
import { AuthenticationService } from '../app-authentication/authentication.service';
import { Subject } from 'rxjs/Subject';
var FacebookService = (function () {
    function FacebookService(authenticationService) {
        this.authenticationService = authenticationService;
        this.board = new Subject();
        this.board$ = this.board.asObservable();
        FB.init(FacebookConstants.FACEBOOK_CONFIGURATION);
    }
    FacebookService.prototype.login = function () {
        var _this = this;
        FB.login(function (result) {
            FB.api(FacebookConstants.FACEBOOK_API_URL, function (userInfo) {
                return _this.authenticationService
                    .authenticate(userInfo.email)
                    .subscribe(function (data) {
                    _this.board.next(data);
                }, function (error) {
                    if (error.status === 401) {
                        _this.board.next(null);
                    }
                });
            });
        }, FacebookConstants.FACEBOOK_SCOPE);
    };
    FacebookService.prototype.statusChangeCallback = function (response) {
        console.log(response);
    };
    FacebookService.prototype.ngOnInit = function () {
        var _this = this;
        FB.getLoginStatus(function (response) {
            _this.statusChangeCallback(response);
        });
    };
    return FacebookService;
}());
FacebookService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthenticationService])
], FacebookService);
export { FacebookService };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/facebook-login/facebook.service.js.map