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
import { MdDialogRef } from '@angular/material';
import { BoardService } from '../board/board.service';
var BoardFileGalleryComponent = (function () {
    function BoardFileGalleryComponent(boardDialogRef, boardService, zone) {
        var _this = this;
        this.boardDialogRef = boardDialogRef;
        this.boardService = boardService;
        this.zone = zone;
        this.boardService
            .getFilesForUser()
            .subscribe(function (data) {
            console.log(1);
            console.log(data);
            _this.zone.run(function () {
                _this.files = data;
            });
        }, function (error) { });
    }
    BoardFileGalleryComponent.prototype.closeAndInsertIntoEditor = function (url) {
        console.log(url);
        this.boardDialogRef.close();
        this.boardService.insertFromGallery(url);
    };
    return BoardFileGalleryComponent;
}());
BoardFileGalleryComponent = __decorate([
    Component({
        selector: 'boad-file-gallery',
        templateUrl: './board-file-gallery.component.html'
    }),
    __metadata("design:paramtypes", [MdDialogRef,
        BoardService,
        NgZone])
], BoardFileGalleryComponent);
export { BoardFileGalleryComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-file-gallery/board-file-gallery.component.js.map