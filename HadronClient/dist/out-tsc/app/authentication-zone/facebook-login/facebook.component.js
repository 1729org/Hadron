var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Output } from '@angular/core';
import { FacebookService } from './facebook.service';
var FacebookComponent = (function () {
    function FacebookComponent(facebookService) {
        var _this = this;
        this.facebookService = facebookService;
        this.onAuthentication = new EventEmitter();
        facebookService.authentication$.subscribe(function (authentication) {
            _this.onAuthentication.emit(authentication);
        });
    }
    FacebookComponent.prototype.onFacebookLoginClick = function () {
        this.facebookService
            .login();
    };
    ;
    return FacebookComponent;
}());
__decorate([
    Output(),
    __metadata("design:type", Object)
], FacebookComponent.prototype, "onAuthentication", void 0);
FacebookComponent = __decorate([
    Component({
        selector: 'facebook-login',
        templateUrl: './facebook.component.html',
        styleUrls: ['./facebook.component.css'],
        providers: [FacebookService]
    }),
    __metadata("design:paramtypes", [FacebookService])
], FacebookComponent);
export { FacebookComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/authentication-zone/facebook-login/facebook.component.js.map