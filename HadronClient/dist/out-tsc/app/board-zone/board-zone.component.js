var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { BoardService } from '../board-zone/board/board.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import * as Quill from 'quill';
var Parchment = Quill.import('parchment');
var Block = Parchment.query('block');
Block.tagName = 'DIV';
Quill.register(Block, true);
var BoardZoneComponent = (function () {
    function BoardZoneComponent(boardService, authenticationService, router) {
        this.boardService = boardService;
        this.authenticationService = authenticationService;
        this.router = router;
        if (!authenticationService.isAuthenticated()) {
            this.router.navigateByUrl('/login');
        }
        this.boardName = boardService.getCurrentBoardName();
        console.log(this.boardName);
    }
    return BoardZoneComponent;
}());
BoardZoneComponent = __decorate([
    Component({
        selector: 'board-zone',
        templateUrl: './board-zone.component.html',
    }),
    __metadata("design:paramtypes", [BoardService,
        AuthenticationService,
        Router])
], BoardZoneComponent);
export { BoardZoneComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-zone.component.js.map