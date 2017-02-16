var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, ConnectionBackend } from '@angular/http';
var HadronHttp = (function (_super) {
    __extends(HadronHttp, _super);
    function HadronHttp(backend, defaultOptions) {
        return _super.call(this, backend, defaultOptions) || this;
    }
    HadronHttp.prototype.request = function (url, options) {
        console.log(url);
        return this.intercept(_super.prototype.request.call(this, url, options));
    };
    HadronHttp.prototype.get = function (url, options) {
        console.log(url);
        return this.intercept(_super.prototype.get.call(this, url, options));
    };
    HadronHttp.prototype.post = function (url, body, options) {
        return this.intercept(_super.prototype.post.call(this, url, body, this.getRequestOptionArgs(options)));
    };
    HadronHttp.prototype.put = function (url, body, options) {
        return this.intercept(_super.prototype.put.call(this, url, body, this.getRequestOptionArgs(options)));
    };
    HadronHttp.prototype.delete = function (url, options) {
        return this.intercept(_super.prototype.delete.call(this, url, options));
    };
    HadronHttp.prototype.getRequestOptionArgs = function (options) {
        options.headers.append('Content-Type', 'application/json');
        return options;
    };
    HadronHttp.prototype.intercept = function (observable) {
        return observable.catch(function (err, source) {
            if (err.status == 403) {
                return Observable.empty();
            }
            return Observable.throw(err);
        });
    };
    return HadronHttp;
}(Http));
HadronHttp = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConnectionBackend, RequestOptions])
], HadronHttp);
export { HadronHttp };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/generics/generics.interceptor.js.map