var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { BoardService } from '../board/board.service';
var BoardListDialogComponent = (function () {
    function BoardListDialogComponent(boardDialogRef, boardService, elementRef) {
        var _this = this;
        this.boardDialogRef = boardDialogRef;
        this.boardService = boardService;
        this.elementRef = elementRef;
        boardService.getBoardList().subscribe(function (data) {
            _this.boardList = data;
        }, function (error) {
        });
    }
    BoardListDialogComponent.prototype.markOrChangeBoard = function (event, index, board) {
        var element = this.elementRef.nativeElement.querySelector('#board_element_' + index);
        if (element.className.indexOf('list-group-item-success') >= 0) {
            this.boardDialogRef.close(this.selectedBoard);
        }
        else {
            this.removeMarkClass();
            this.selectedBoard = board;
            element.className += " list-group-item-success";
        }
    };
    BoardListDialogComponent.prototype.removeMarkClass = function () {
        var elements = this.elementRef.nativeElement.querySelectorAll("a[id^=board_element]");
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            element.className = "list-group-item";
        }
    };
    return BoardListDialogComponent;
}());
BoardListDialogComponent = __decorate([
    Component({
        selector: 'boad-list-dialog',
        templateUrl: './board-list-dialog.component.html',
        styleUrls: ['./board-list-dialog.component.css']
    }),
    __metadata("design:paramtypes", [MdDialogRef,
        BoardService,
        ElementRef])
], BoardListDialogComponent);
export { BoardListDialogComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-list-dialog/board-list-dialog.component.js.map