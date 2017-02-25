var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { BoardService } from '../board-zone/board/board.service';
import { AuthenticationService } from './app-authentication/authentication.service';
import { MdDialog } from '@angular/material';
import { BoardDialogComponent } from './board-dialog/board-dialog.component';
import { Router } from '@angular/router';
var AuthenticationZoneComponent = (function () {
    function AuthenticationZoneComponent(boardService, authenticationService, zone, dialog, router) {
        this.boardService = boardService;
        this.authenticationService = authenticationService;
        this.zone = zone;
        this.dialog = dialog;
        this.router = router;
        if (authenticationService.isAuthenticated()) {
            this.getBoard();
        }
    }
    AuthenticationZoneComponent.prototype.onAuthentication = function (authentication) {
        var _this = this;
        this.zone.run(function () {
            _this.authenticated = authentication[0];
        });
        if (this.authenticated) {
            if (authentication.length === 1 || !authentication[1]) {
                this.dialog
                    .open(BoardDialogComponent, {
                    disableClose: true
                })
                    .afterClosed().subscribe(function (result) {
                    _this.createBoard(result);
                });
            }
        }
    };
    AuthenticationZoneComponent.prototype.createBoard = function (name) {
        var _this = this;
        this.boardService
            .createBoard(name)
            .subscribe(function (data) {
            console.log(_this.boardService.hasBoard());
            _this.router.navigateByUrl('/board');
        }, function (error) {
        });
    };
    AuthenticationZoneComponent.prototype.getBoard = function () {
        var _this = this;
        this.boardService
            .getLastModifiedBoard()
            .subscribe(function (data) {
            _this.router.navigateByUrl('/board');
        }, function (error) {
        });
    };
    return AuthenticationZoneComponent;
}());
AuthenticationZoneComponent = __decorate([
    Component({
        selector: 'authentication-zone',
        templateUrl: './authentication-zone.component.html',
        styleUrls: ['./authentication-zone.component.css']
    }),
    __metadata("design:paramtypes", [BoardService,
        AuthenticationService,
        NgZone,
        MdDialog,
        Router])
], AuthenticationZoneComponent);
export { AuthenticationZoneComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/authentication-zone/authentication-zone.component.js.map