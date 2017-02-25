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
import { GenericConstants } from '../../generics/generics.constants';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { BoardConstants } from './board.constants';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var BoardService = (function () {
    function BoardService(hadronHttp) {
        this.hadronHttp = hadronHttp;
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
    BoardService.prototype.getLastModifiedBoard = function () {
        var _this = this;
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + BoardConstants.GET_LAST_MODIFIED_BOARD_URL)
            .map(function (response) {
            console.log(response.json());
            _this.board = Tools.mapToBoard(response.json());
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getBoard = function (name) {
        var _this = this;
        var params = new URLSearchParams();
        params.set('name', name);
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + BoardConstants.GET_BOARD_BY_NAME_URL, {
            search: params
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
    BoardService.prototype.getCurrentBoardName = function () {
        return this.board.name;
    };
    BoardService.prototype.getBoardList = function () {
        var _this = this;
        return this.hadronHttp
            .get("" + GenericConstants.BASE_URL + BoardConstants.LIST_BOARDS_URL)
            .map(function (response) {
            _this.boardList = Tools.mapToBoardList(response.json().data);
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.setBoard = function (board) {
        this.board = board;
    };
    return BoardService;
}());
BoardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HadronHttp])
], BoardService);
export { BoardService };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board/board.service.js.map