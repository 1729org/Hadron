var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone, ViewChild } from '@angular/core';
import { BoardService } from '../board-zone/board/board.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication-zone/app-authentication/authentication.service';
import { MdDialog } from '@angular/material';
import { BoardListDialogComponent } from './board-list-dialog/board-list-dialog.component';
import { BoardNewDialogComponent } from './board-new-dialog/board-new-dialog.component';
import { TextDocumentNewDialogComponent } from './text-document-new-dialog/text-document-new-dialog.component';
import { BoardConstants } from '../board-zone/board/board.constants';
import { RoadMapDialogComponent } from './road-map-dialog/road-map-dialog.component';
import { TextDocumentListDialogComponent } from './text-document-list-dialog/text-document-list-dialog.component';
import { BoardShareDialogComponent } from './board-share-dialog/board-share-dialog.component';
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
            console.log('does not have board');
            boardService.getLastModifiedBoard().subscribe(function (data) {
                _this.zone.run(function () {
                    _this.boardName = boardService.getCurrentBoardName();
                    console.log('here');
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
    BoardZoneComponent.prototype.openSideNav = function () {
        if (!this.sidenav.isOpen) {
            this.sidenav.toggle();
        }
    };
    BoardZoneComponent.prototype.setQuillEditor = function (event) {
        this.boardService.setQuillEditor(event);
    };
    BoardZoneComponent.prototype.shareBoard = function () {
        var _this = this;
        if (this.boardService.isOwner()) {
            this.dialog.closeAll();
            this.boardService
                .getMembers()
                .subscribe(function (data) {
                _this.dialog
                    .open(BoardShareDialogComponent, { width: "55vw", data: data.userIds })
                    .afterClosed().subscribe(function (result) {
                    if (result && result.length !== 0) {
                        console.log(data.userIds, result);
                        if (data.userIds.indexOf(result) < 0 && data.userIds.indexOf(_this.boardService.getOwnerEmail()) < 0) {
                            _this.boardService
                                .shareBoard(result)
                                .subscribe(function (data) { }, function (error) { });
                        }
                    }
                });
            }, function (error) { });
        }
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
    BoardZoneComponent.prototype.showRoadMap = function () {
        this.dialog.closeAll();
        this.dialog
            .open(RoadMapDialogComponent, { width: "65vw" })
            .afterClosed().subscribe(function (result) {
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
                        console.log(_this.boardService.getCurrentTextDocumentName());
                        _this.textDocumentName = _this.boardService.getCurrentTextDocumentName();
                    });
                }, function (error) { });
            }
        });
    };
    BoardZoneComponent.prototype.changeTextDocument = function () {
        var _this = this;
        this.dialog.closeAll();
        this.dialog
            .open(TextDocumentListDialogComponent, { width: "55vw" })
            .afterClosed().subscribe(function (result) {
            if (result && result.name !== _this.boardName) {
                _this.boardService
                    .getTextDocument(result.ownerEmail, result.name)
                    .subscribe(function (data) {
                    _this.zone.run(function () {
                        console.log(_this.boardService.getCurrentTextDocumentName());
                        _this.textDocumentName = _this.boardService.getCurrentTextDocumentName();
                    });
                }, function (error) { });
            }
            console.log(result);
        });
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
__decorate([
    ViewChild('sidenav'),
    __metadata("design:type", Object)
], BoardZoneComponent.prototype, "sidenav", void 0);
BoardZoneComponent = __decorate([
    Component({
        selector: 'board-zone',
        templateUrl: './board-zone.component.html',
        styleUrls: ['./board-zone.component.css']
    }),
    __metadata("design:paramtypes", [BoardService,
        AuthenticationService,
        NgZone,
        MdDialog,
        Router])
], BoardZoneComponent);
export { BoardZoneComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-zone.component.js.map