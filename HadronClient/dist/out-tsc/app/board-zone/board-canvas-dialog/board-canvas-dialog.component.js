var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, HostListener } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { BoardService } from '../board/board.service';
var BoardCanvasDialogComponent = (function () {
    function BoardCanvasDialogComponent(boardDialogRef, boardService) {
        this.boardDialogRef = boardDialogRef;
        this.boardService = boardService;
        this.ctrlDown = false;
        this.leftMouseDown = false;
        this.pathStack = [];
    }
    BoardCanvasDialogComponent.prototype.closeCanvas = function () {
        console.log('escaped');
        this.boardDialogRef.close(this.blob);
    };
    BoardCanvasDialogComponent.prototype.clearCanvas = function () {
        console.log('clearCanvas');
        this.boardService.clearCanvasPaths();
        for (var _i = 0, _a = this.pathStack; _i < _a.length; _i++) {
            var path = _a[_i];
            path.remove();
        }
        this.pathStack = [];
    };
    BoardCanvasDialogComponent.prototype.undo = function () {
        this.boardService.popCanvasPath();
        if (this.pathStack.length !== 0) {
            var path = this.pathStack.pop();
            path.remove();
        }
    };
    BoardCanvasDialogComponent.prototype.ngOnInit = function () {
        var scope = new paper.PaperScope();
        scope.setup(this.canvas.nativeElement);
        this.boardService.setPaper(scope);
        this.scope = scope;
        if (this.boardService.hasBoard()) {
            var paths = this.boardService.getGraphicContent();
            console.log(paths);
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                this.pathStack.push(new this.scope.Path({
                    segments: path.path,
                    strokeColor: 'black',
                    fullySelected: false
                }).simplify(2));
            }
        }
    };
    BoardCanvasDialogComponent.prototype.onMouseup = function (event) {
        var _this = this;
        if (!this.ctrlDown && !this.meter) {
            if (this.leftMouseDown && this.currentPath) {
                this.currentPath.simplify(2);
                this.pathStack.push(this.currentPath);
                var currentSegments = [];
                for (var _i = 0, _a = this.currentPath.segments; _i < _a.length; _i++) {
                    var segment = _a[_i];
                    currentSegments.push([segment.point.x, segment.point.y]);
                }
                this.boardService.addPath(currentSegments);
                this.currentPath = null;
            }
        }
        else {
            if (this.meter) {
                var meterSegments = this.meter.segments;
                var minX = this.canvas.nativeElement.width, maxX = 0, minY = this.canvas.nativeElement.height, maxY = 0;
                for (var _b = 0, meterSegments_1 = meterSegments; _b < meterSegments_1.length; _b++) {
                    var segment = meterSegments_1[_b];
                    if (minX > segment.point.x) {
                        minX = segment.point.x;
                    }
                    if (maxX < segment.point.x) {
                        maxX = segment.point.x;
                    }
                    if (minY > segment.point.y) {
                        minY = segment.point.y;
                    }
                    if (maxY < segment.point.y) {
                        maxY = segment.point.y;
                    }
                }
                var width = maxX - minX, height = maxY - minY;
                var clipCanvasNative = this.clipCanvas.nativeElement;
                clipCanvasNative.width = width;
                clipCanvasNative.height = height;
                var clipContext = clipCanvasNative.getContext('2d');
                clipContext.drawImage(this.canvas.nativeElement, minX + 1, minY + 1, width - 2, height - 2, 0, 0, clipCanvasNative.width, clipCanvasNative.height);
                var data = clipCanvasNative.toBlob(function (blob) {
                    _this.blob = blob;
                    _this.blob.name = 'temp_name';
                    _this.blob.lastModifiedDate = new Date();
                    _this.boardService.uploadBlob(_this.blob);
                });
                this.meter.remove();
                this.meter = null;
            }
            this.clipRectangleStart = null;
        }
        this.leftMouseDown = false;
    };
    BoardCanvasDialogComponent.prototype.onMousemove = function (event) {
        var mousePos = this.getMousePos(event);
        if (this.leftMouseDown) {
            if (!this.ctrlDown) {
                this.currentPath.add(mousePos);
            }
            else {
                if (this.clipRectangleStart) {
                    if (this.meter) {
                        this.meter.remove();
                        this.meter = null;
                    }
                    var size = new this.scope.Size(mousePos[0] - this.clipRectangleStart.x, mousePos[1] - this.clipRectangleStart.y);
                    console.log(size, this.clipRectangleStart);
                    this.meter = new this.scope.Path.Rectangle(this.clipRectangleStart, size);
                    this.meter.strokeColor = 'black';
                    this.scope.view.update();
                }
            }
        }
    };
    BoardCanvasDialogComponent.prototype.onMousedown = function (event) {
        this.leftMouseDown = true;
        var mousePos = this.getMousePos(event);
        if (this.ctrlDown) {
            this.clipRectangleStart = new this.scope.Point(mousePos[0], mousePos[1]);
        }
        else {
            this.currentPath = new this.scope.Path({
                segments: [mousePos],
                strokeColor: 'black',
                fullySelected: false
            });
        }
    };
    BoardCanvasDialogComponent.prototype.onCtrldown = function (event) {
        if (event.key === 'Control') {
            if (!this.leftMouseDown) {
                this.ctrlDown = true;
            }
        }
    };
    BoardCanvasDialogComponent.prototype.onCtrlup = function (event) {
        if (event.key === 'Control') {
            this.ctrlDown = false;
            if (this.leftMouseDown) {
                this.clipRectangleStart = null;
            }
        }
    };
    BoardCanvasDialogComponent.prototype.getMousePos = function (e) {
        var rect = this.canvas.nativeElement.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };
    return BoardCanvasDialogComponent;
}());
__decorate([
    ViewChild('whiteBoard'),
    __metadata("design:type", Object)
], BoardCanvasDialogComponent.prototype, "canvas", void 0);
__decorate([
    ViewChild('clipCanvas'),
    __metadata("design:type", Object)
], BoardCanvasDialogComponent.prototype, "clipCanvas", void 0);
__decorate([
    HostListener('document:mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], BoardCanvasDialogComponent.prototype, "onMouseup", null);
__decorate([
    HostListener('document:mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], BoardCanvasDialogComponent.prototype, "onMousemove", null);
__decorate([
    HostListener('document:mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], BoardCanvasDialogComponent.prototype, "onMousedown", null);
__decorate([
    HostListener('document:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], BoardCanvasDialogComponent.prototype, "onCtrldown", null);
__decorate([
    HostListener('document:keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], BoardCanvasDialogComponent.prototype, "onCtrlup", null);
BoardCanvasDialogComponent = __decorate([
    Component({
        selector: 'boad-canvas-dialog',
        templateUrl: './board-canvas-dialog.component.html'
    }),
    __metadata("design:paramtypes", [MdDialogRef,
        BoardService])
], BoardCanvasDialogComponent);
export { BoardCanvasDialogComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board-canvas-dialog/board-canvas-dialog.component.js.map