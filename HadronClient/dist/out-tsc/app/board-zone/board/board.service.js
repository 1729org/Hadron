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
import { AuthenticationService } from '../../authentication-zone/app-authentication/authentication.service';
import { GenericConstants } from '../../generics/generics.constants';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { BoardConstants } from './board.constants';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var BoardService = (function () {
    function BoardService(hadronHttp, authenticationService) {
        var _this = this;
        this.hadronHttp = hadronHttp;
        this.authenticationService = authenticationService;
        this.logout = new Subject();
        this.logout$ = this.logout.asObservable();
        hadronHttp.logout$.subscribe(function (logout) {
            if (logout) {
                _this.clearAndLogout();
                _this.logout.next(true);
            }
        });
    }
    BoardService.prototype.createBoard = function (name) {
        var _this = this;
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CREATE_BOARD_URL, { name: name })
            .map(function (response) {
            _this.board = Tools.mapToBoard(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.createTextDocument = function (name) {
        var _this = this;
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CREATE_TEXT_DOCUMENT_URL, {
            ownerEmail: this.board.ownerEmail,
            boardName: this.board.name,
            textDocumentName: name
        })
            .map(function (response) {
            _this.board.textDocument = Tools.mapToTextDocument(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getLastModifiedBoard = function () {
        var _this = this;
        console.log('lastmodif');
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + BoardConstants.GET_LAST_MODIFIED_BOARD_URL)
            .map(function (response) {
            console.log(response.json());
            _this.board = Tools.mapToBoard(response.json());
            return {};
        })
            .catch(function (error) {
            console.log(error);
            return Observable.throw(error);
        });
    };
    BoardService.prototype.changeBoardName = function (newBoardName) {
        var _this = this;
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CHANGE_BOARD_NAME_URL, {
            ownerEmail: this.board.ownerEmail,
            boardName: this.board.name,
            newBoardName: newBoardName
        })
            .map(function (response) {
            _this.board = Tools.mapToBoard(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.changeTextDocumentName = function (newTextDocumentName) {
        var _this = this;
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CHANGE_TEXT_DOCUMENT_NAME_URL, {
            boardName: this.board.name,
            ownerEmail: this.board.ownerEmail,
            textDocumentName: this.board.textDocument.name,
            newTextDocumentName: newTextDocumentName
        })
            .map(function (response) {
            _this.board.textDocument = Tools.mapToTextDocument(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getBoard = function (ownerEmail, boardName) {
        var _this = this;
        /*let params: URLSearchParams = new URLSearchParams();
        params.set('name', name);*/
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.GET_BOARD_BY_NAME_URL, {
            ownerEmail: ownerEmail,
            boardName: boardName
        })
            .map(function (response) {
            _this.board = Tools.mapToBoard(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.hasBoard = function () {
        return this.board != null;
    };
    BoardService.prototype.isOwner = function () {
        return this.authenticationService.getClaims().email === this.board.ownerEmail;
    };
    BoardService.prototype.getCurrentBoardName = function () {
        return this.board.name;
    };
    BoardService.prototype.getCurrentTextDocumentName = function () {
        console.log(this.board.textDocument.name);
        return this.board.textDocument.name;
    };
    BoardService.prototype.getBoardList = function () {
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + BoardConstants.LIST_BOARDS_URL)
            .map(function (response) {
            var boardList = Tools.mapToBoardList(response.json());
            return boardList || {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.setBoard = function (board) {
        this.board = board;
    };
    BoardService.prototype.clearAndLogout = function () {
        this.authenticationService.logout();
        this.board = null;
    };
    return BoardService;
}());
BoardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HadronHttp,
        AuthenticationService])
], BoardService);
export { BoardService };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board/board.service.js.map