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
import { VisNodes, VisEdges, VisNetworkService } from 'ng2-vis';
var ExampleNetworkData = (function () {
    function ExampleNetworkData() {
    }
    return ExampleNetworkData;
}());
var RoadMapDialogComponent = (function () {
    function RoadMapDialogComponent(boardDialogRef, visNetworkService) {
        this.boardDialogRef = boardDialogRef;
        this.visNetworkService = visNetworkService;
        this.visNetwork = 'networkId1';
    }
    RoadMapDialogComponent.prototype.networkInitialized = function () {
        var _this = this;
        this.visNetworkService.on(this.visNetwork, 'click');
        this.visNetworkService.click
            .subscribe(function (eventData) {
            console.log(eventData[0]);
            if (eventData[0] === _this.visNetwork) {
                if (eventData[1].nodes.length === 0) {
                    _this.sidenav.close();
                }
                else {
                    console.log(_this.visNetworkData.nodes.getById(eventData[1].nodes[0]));
                    if (!_this.sidenav.isOpen) {
                        _this.sidenav.open();
                    }
                }
            }
        });
    };
    RoadMapDialogComponent.prototype.ngOnInit = function () {
        var nodes = new VisNodes([
            { id: '1', label: 'Node 1' },
            { id: '2', label: 'Node 2' },
            { id: '3', label: 'Node 3' },
            { id: '4', label: 'Node 4' },
            { id: '5', label: 'Node 5', title: 'Title of Node 5' }
        ]);
        var edges = new VisEdges([
            { from: '1', to: '3' },
            { from: '1', to: '2' },
            { from: '2', to: '4' },
            { from: '2', to: '5' }
        ]);
        this.visNetworkData = {
            nodes: nodes,
            edges: edges
        };
        this.visNetworkOptions = {};
    };
    RoadMapDialogComponent.prototype.ngOnDestroy = function () {
        this.visNetworkService.off(this.visNetwork, 'click');
    };
    return RoadMapDialogComponent;
}());
__decorate([
    ViewChild('sidenav'),
    __metadata("design:type", Object)
], RoadMapDialogComponent.prototype, "sidenav", void 0);
RoadMapDialogComponent = __decorate([
    Component({
        selector: 'road-map-dialog',
        templateUrl: './road-map-dialog.component.html',
        styleUrls: ['./road-map-dialog.component.css']
    }),
    __metadata("design:paramtypes", [MdDialogRef,
        VisNetworkService])
], RoadMapDialogComponent);
export { RoadMapDialogComponent };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/road-map-dialog/road-map-dialog.component.js.map