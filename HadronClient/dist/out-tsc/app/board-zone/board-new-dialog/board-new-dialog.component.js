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
var BoardNewDialogComponent = (function () {
    function BoardNewDialogComponent(boardDialogRef) {
        this.boardDialogRef = boardDialogRef;
    }
    BoardNewDialogComponent.prototype.createBoard = function () {
        this.boardDialogRef.close(this.boardNameInput.nativeElement.value);
    };
    return BoardNewDialogComponent;
}());
__decorate([
    ViewChild('boardNameInput'),
    __metadata("design:type", Object)
], BoardNewDialogComponent.prototype, "boardNameInput", void 0);
BoardNewDialogComponent = __decorate([
    Component({
        selector: 'boad-new-dialog',
        templateUrl: './board-new-dialog.component.html'
    }),
    __metadata("design:paramtypes", [MdDialogRef])
], BoardNewDialogComponent);
export { BoardNewDialogComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-new-dialog/board-new-dialog.component.js.map