var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';
var BoardShareDialogComponent = (function () {
    function BoardShareDialogComponent(boardDialogRef) {
        this.boardDialogRef = boardDialogRef;
    }
    BoardShareDialogComponent.prototype.shareBoard = function () {
        this.boardDialogRef.close(this.emailInput.nativeElement.value);
    };
    return BoardShareDialogComponent;
}());
__decorate([
    ViewChild('emailInput'),
    __metadata("design:type", Object)
], BoardShareDialogComponent.prototype, "emailInput", void 0);
BoardShareDialogComponent = __decorate([
    Component({
        selector: 'boad-share-dialog',
        templateUrl: './board-share-dialog.component.html'
    }),
    __metadata("design:paramtypes", [MdDialogRef])
], BoardShareDialogComponent);
export { BoardShareDialogComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-share-dialog/board-share-dialog.component.js.map