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
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import { MdDialog } from '@angular/material';
import { BoardListDialogComponent } from './board-list-dialog/board-list-dialog.component';
import { BoardNewDialogComponent } from './board-new-dialog/board-new-dialog.component';
import { TextDocumentNewDialogComponent } from './text-document-new-dialog/text-document-new-dialog.component';
import { BoardConstants } from '../board-zone/board/board.constants';
import * as Quill from 'quill';
var Parchment = Quill.import('parchment');
var Block = Parchment.query('block');
Block.tagName = 'DIV';
Quill.register(Block, true);
var BoardZoneComponent = (function () {
    function BoardZoneComponent(boardService, authenticationService, zone, dialog, router) {
        var _this = this;
        this.boardService = boardService;
        this.authenticationService = authenticationService;
        this.zone = zone;
        this.dialog = dialog;
        this.router = router;
        this.quillModules = BoardConstants.QUILL_MODULES;
        boardService.logout$.subscribe(function (logout) {
            if (logout) {
                _this.clearAndLogout();
            }
        });
        if (!authenticationService.isAuthenticated()) {
            this.router.navigateByUrl('/login');
        }
        if (!boardService.hasBoard()) {
            boardService.getLastModifiedBoard().subscribe(function (data) {
                _this.zone.run(function () {
                    _this.boardName = boardService.getCurrentBoardName();
                    _this.textDocumentName = boardService.getCurrentTextDocumentName();
                });
            }, function (error) { });
        }
        else {
            this.boardName = boardService.getCurrentBoardName();
            this.textDocumentName = boardService.getCurrentTextDocumentName();
        }
        this.showChangeBoardNameInput = false;
        this.showChangeTextDocumentNameInput = false;
    }
    BoardZoneComponent.prototype.setQuillEditor = function (event) {
        this.quillEditor = event;
        this.quillEditor.on('text-change', function (a, b, c, d) {
            console.log(a, b, c, d);
        });
    };
    BoardZoneComponent.prototype.changeBoard = function () {
        var _this = this;
        this.dialog.closeAll();
        this.dialog
            .open(BoardListDialogComponent, { width: "55vw" })
            .afterClosed().subscribe(function (result) {
            if (result && result.name !== _this.boardName) {
                _this.boardService
                    .getBoard(result.ownerEmail, result.name)
                    .subscribe(function (data) {
                    _this.zone.run(function () {
                        _this.boardName = _this.boardService.getCurrentBoardName();
                        _this.textDocumentName = _this.boardService.getCurrentTextDocumentName();
                    });
                }, function (error) { });
            }
            console.log(result);
        });
    };
    BoardZoneComponent.prototype.newBoard = function () {
        var _this = this;
        this.dialog.closeAll();
        this.dialog
            .open(BoardNewDialogComponent)
            .afterClosed().subscribe(function (result) {
            if (result) {
                _this.boardService
                    .createBoard(result)
                    .subscribe(function (data) {
                    _this.zone.run(function () {
                        _this.boardName = _this.boardService.getCurrentBoardName();
                        _this.textDocumentName = _this.boardService.getCurrentTextDocumentName();
                    });
                }, function (error) { });
            }
        });
    };
    BoardZoneComponent.prototype.newTextDocument = function () {
        var _this = this;
        this.dialog.closeAll();
        this.dialog
            .open(TextDocumentNewDialogComponent)
            .afterClosed().subscribe(function (result) {
            if (result) {
                _this.boardService
                    .createTextDocument(result)
                    .subscribe(function (data) {
                    _this.zone.run(function () {
                        _this.textDocumentName = _this.boardService.getCurrentTextDocumentName();
                    });
                }, function (error) { });
            }
        });
    };
    BoardZoneComponent.prototype.changeTextDocument = function () {
        console.log('change-text-document');
    };
    BoardZoneComponent.prototype.showChangeBoardName = function () {
        var _this = this;
        if (!this.boardService.isOwner()) {
            return;
        }
        this.zone.run(function () {
            _this.newBoardName = _this.boardName;
            _this.showChangeBoardNameInput = true;
            _this.boardNameTimeoutId = setTimeout(function () { _this.showChangeBoardNameInput = false; }, 2000);
        });
    };
    BoardZoneComponent.prototype.showChangeTextDocumentName = function () {
        var _this = this;
        this.zone.run(function () {
            _this.newTextDocumentName = _this.textDocumentName;
            _this.showChangeTextDocumentNameInput = true;
            _this.textDocumentNameTimeoutId = setTimeout(function () { _this.showChangeTextDocumentNameInput = false; }, 2000);
        });
    };
    BoardZoneComponent.prototype.focusedBoardNameInput = function () {
        clearTimeout(this.boardNameTimeoutId);
    };
    BoardZoneComponent.prototype.focusedTextDocumentNameInput = function () {
        clearTimeout(this.textDocumentNameTimeoutId);
    };
    BoardZoneComponent.prototype.changeBoardName = function () {
        var _this = this;
        if (this.newBoardName !== this.boardName) {
            this.boardService
                .changeBoardName(this.newBoardName)
                .subscribe(function (data) {
                _this.boardName = _this.newBoardName;
            }, function (error) { });
        }
        this.showChangeBoardNameInput = false;
    };
    BoardZoneComponent.prototype.changeTextDocumentName = function () {
        var _this = this;
        if (this.newTextDocumentName !== this.textDocumentName) {
            this.boardService
                .changeTextDocumentName(this.newTextDocumentName)
                .subscribe(function (data) {
                _this.textDocumentName = _this.newTextDocumentName;
            }, function (error) { });
        }
        this.showChangeTextDocumentNameInput = false;
    };
    BoardZoneComponent.prototype.hideBoardNameInput = function () {
        console.log('lost');
        this.showChangeBoardNameInput = false;
    };
    BoardZoneComponent.prototype.hideTextDocumentNameInput = function () {
        console.log('lost');
        this.showChangeTextDocumentNameInput = false;
    };
    BoardZoneComponent.prototype.clearAndLogout = function () {
        console.log('here');
        this.dialog.closeAll();
        this.boardService.clearAndLogout();
        this.router.navigateByUrl('/login');
    };
    return BoardZoneComponent;
}());
BoardZoneComponent = __decorate([
    Component({
        selector: 'board-zone',
        templateUrl: './board-zone.component.html',
    }),
    __metadata("design:paramtypes", [BoardService,
        AuthenticationService,
        NgZone,
        MdDialog,
        Router])
], BoardZoneComponent);
export { BoardZoneComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-zone.component.js.map