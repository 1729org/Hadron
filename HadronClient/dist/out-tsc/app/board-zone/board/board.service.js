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
import { Path } from '../../models/path';
import { User } from '../../models/user';
import { RoomUsers } from '../../models/room-users';
import { GraphicDocument } from '../../models/graphic-document';
import { AuthenticationService } from '../../authentication-zone/app-authentication/authentication.service';
import { GenericConstants } from '../../generics/generics.constants';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { BoardConstants } from './board.constants';
import { PriorityQueue } from '../../models/priority-queue';
import { RemoteDelta } from '../../models/remote-delta';
import { Uploader } from 'angular2-http-file-upload';
import { QuillUpload } from '../../models/quill-upload';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var BoardService = (function () {
    function BoardService(hadronHttp, authenticationService, uploaderService) {
        var _this = this;
        this.hadronHttp = hadronHttp;
        this.authenticationService = authenticationService;
        this.uploaderService = uploaderService;
        this.logout = new Subject();
        this.logout$ = this.logout.asObservable();
        this.updateRoomUsers = new Subject();
        this.updateRoomUsers$ = this.updateRoomUsers.asObservable();
        console.log(paper);
        hadronHttp.logout$.subscribe(function (logout) {
            if (logout) {
                _this.clearAndLogout();
                _this.logout.next(true);
            }
        });
        this.deltaQueue = new PriorityQueue();
        this.quillBuffer = [];
    }
    BoardService.prototype.createBoard = function (name) {
        var _this = this;
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CREATE_BOARD_URL, { name: name })
            .map(function (response) {
            if (_this.socket && _this.socket.connected) {
                _this.socket.disconnect();
            }
            _this.board = Tools.mapToBoard(response.json());
            _this.board.graphicDocument = new GraphicDocument();
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
            if (_this.socket && _this.socket.connected) {
                _this.socket.disconnect();
            }
            if (_this.isShared() && _this.hasTextDocument()) {
                _this.connectToServer(_this.getTextDocumentRoomId());
            }
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
            _this.board = Tools.mapToBoard(response.json());
            _this.board.graphicDocument = new GraphicDocument();
            if (_this.socket && _this.socket.connected) {
                _this.socket.disconnect();
            }
            if (!_this.isShared()) {
                console.log('not shared');
                _this.updateQuillFromTextDocument();
            }
            if (_this.isShared() && _this.hasTextDocument()) {
                _this.connectToServer(_this.getTextDocumentRoomId());
            }
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getMembers = function () {
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.GET_BOARD_MEMBERS_URL, {
            boardName: this.board.name
        })
            .map(function (response) {
            return response.json() || {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.shareBoard = function (email) {
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.SHARE_BOARD_URL, {
            shareEmail: email,
            boardName: this.board.name
        })
            .map(function (response) {
            return response.json() || {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.changeBoardName = function (newBoardName) {
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CHANGE_BOARD_NAME_URL, {
            ownerEmail: this.board.ownerEmail,
            boardName: this.board.name,
            newBoardName: newBoardName
        })
            .map(function (response) {
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.changeTextDocumentName = function (newTextDocumentName) {
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.CHANGE_TEXT_DOCUMENT_NAME_URL, {
            boardName: this.board.name,
            ownerEmail: this.board.ownerEmail,
            textDocumentName: this.board.textDocument.name,
            newTextDocumentName: newTextDocumentName
        })
            .map(function (response) {
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getBoard = function (ownerEmail, boardName) {
        var _this = this;
        if (this.saveTimerId) {
            clearInterval(this.saveTimerId);
            this.saveTimerId = null;
            this.lastModifiedTime = null;
        }
        this.saveTextDocumentContent()
            .subscribe(function (data) { }, function (error) { });
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.GET_BOARD_BY_NAME_URL, {
            ownerEmail: ownerEmail,
            boardName: boardName
        })
            .map(function (response) {
            _this.board = Tools.mapToBoard(response.json());
            _this.board.graphicDocument = new GraphicDocument();
            if (_this.socket && _this.socket.connected) {
                _this.socket.disconnect();
            }
            if (_this.isShared() && _this.hasTextDocument()) {
                _this.connectToServer(_this.getTextDocumentRoomId());
            }
            if (!_this.isShared()) {
                _this.updateQuillFromTextDocument();
            }
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
    BoardService.prototype.isShared = function () {
        return this.board.isShared;
    };
    BoardService.prototype.hasTextDocument = function () {
        return this.board.textDocument != null;
    };
    BoardService.prototype.getTextDocumentRoomId = function () {
        return this.board.textDocument.roomId;
    };
    BoardService.prototype.getOwnerEmail = function () {
        return this.board.ownerEmail;
    };
    BoardService.prototype.getCurrentBoardName = function () {
        return this.board.name;
    };
    BoardService.prototype.getCurrentTextDocumentName = function () {
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
    BoardService.prototype.getTextDocumentList = function () {
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.LIST_TEXT_DOCUMENTS_URL, {
            boardName: this.board.name
        })
            .map(function (response) {
            var textDocumentList = Tools.mapToBoardList(response.json());
            return textDocumentList || {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.getTextDocument = function (ownerEmail, name) {
        var _this = this;
        if (this.saveTimerId) {
            clearInterval(this.saveTimerId);
            this.saveTimerId = null;
            this.lastModifiedTime = null;
        }
        this.saveTextDocumentContent()
            .subscribe(function (data) { }, function (error) { });
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.GET_TEXT_DOCUMENT_BY_NAME_URL, {
            ownerEmail: ownerEmail,
            boardName: this.board.name,
            textDocumentName: name
        })
            .map(function (response) {
            var textDocument = Tools.mapToTextDocument(response.json());
            _this.board.textDocument = textDocument;
            if (_this.socket && _this.socket.connected) {
                _this.socket.disconnect();
            }
            if (_this.isShared() && _this.hasTextDocument()) {
                _this.connectToServer(_this.getTextDocumentRoomId());
            }
            if (!_this.isShared()) {
                _this.updateQuillFromTextDocument();
            }
            return textDocument || {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.updateQuillFromTextDocument = function () {
        if (this.board && this.board.textDocument && this.board.textDocument.content && this.quillEditor) {
            this.quillEditor.setContents(this.board.textDocument.content, 'initial');
        }
    };
    BoardService.prototype.setBoard = function (board) {
        this.board = board;
        this.board.graphicDocument = new GraphicDocument();
        if (!this.isShared()) {
            console.log('not shared');
            this.updateQuillFromTextDocument();
        }
        else {
            this.connectToServer(this.board.textDocument.roomId);
        }
    };
    BoardService.prototype.saveTextDocumentContent = function () {
        console.log('saving');
        return this.hadronHttp
            .post("" + GenericConstants.BASE_URL + BoardConstants.SAVE_TEXT_DOCUMENT_URL, {
            ownerEmail: this.board.ownerEmail,
            boardName: this.board.name,
            textDocumentName: this.board.textDocument.name,
            delta: this.quillEditor.getContents()
        })
            .map(function (response) {
            return {};
        })
            .catch(function (error) {
            return Observable.throw(error);
        });
    };
    BoardService.prototype.setPaper = function (paper) {
        this.paper = paper;
    };
    BoardService.prototype.addPath = function (path) {
        if (this.board && this.board.graphicDocument) {
            var newPath = new Path();
            newPath.path = path;
            this.board.graphicDocument.pushToContent(newPath);
        }
    };
    BoardService.prototype.getGraphicContent = function () {
        return this.board.graphicDocument.content;
    };
    BoardService.prototype.uploadBlob = function (blob) {
        var quillUpload = new QuillUpload(blob);
        quillUpload.formData = { email: this.authenticationService.getClaims().email, boardId: this.board.id };
        this.uploaderService.onSuccessUpload = function (item, response, status, headers) {
            console.log(item);
        };
        this.uploaderService.onErrorUpload = function (item, response, status, headers) {
            console.log(item);
        };
        this.uploaderService.onCompleteUpload = function (item, response, status, headers) {
            console.log(item);
        };
        this.uploaderService.upload(quillUpload);
    };
    BoardService.prototype.clearCanvasPaths = function () {
        this.board.graphicDocument.clearContent();
    };
    BoardService.prototype.popCanvasPath = function () {
        this.board.graphicDocument.popFromContent();
    };
    BoardService.prototype.setQuillEditor = function (quillEditor) {
        var _this = this;
        console.log('setting quill editor');
        this.quillEditor = quillEditor;
        console.log('quill editor set');
        this.quillEditor.disable();
        console.log('quill editor disabled');
        if ((this.board && !this.isShared()) || (this.board && this.isMaster())) {
            console.log('trying to update');
            this.updateQuillFromTextDocument();
            console.log('should enable');
            this.quillEditor.enable();
        }
        console.log('registered text change handler');
        this.quillEditor.on('text-change', function (newDelta, oldDelta, source) {
            console.log('text changed');
            if (_this.isShared()) {
                if (source !== 'initial' && source !== 'remote') {
                    _this.socket.emit('deltaSyncEvent', {
                        delta: newDelta,
                        timestamp: Date.parse(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
                    });
                }
            }
            if (_this.isMaster() || !_this.isShared()) {
                _this.lastModifiedTime = Date.now();
                if (source !== 'initial') {
                    if (!_this.saveTimerId) {
                        _this.saveTimerId = setInterval(function () {
                            if (Date.now() - _this.lastModifiedTime > (BoardConstants.IDLE_INTERVAL * 1000)) {
                                clearInterval(_this.saveTimerId);
                                _this.saveTimerId = null;
                            }
                            _this.saveTextDocumentContent().subscribe(function (data) { }, function (error) { });
                        }, BoardConstants.QUILL_SAVE_INTERVAL * 1000);
                    }
                }
                else {
                    _this.quillEditor.enable();
                }
            }
            if (_this.isShared() && !_this.isMaster()) {
                if (_this.deltaQueue) {
                    for (var _i = 0, _a = _this.deltaQueue.asArray(); _i < _a.length; _i++) {
                        var remoteDelta = _a[_i];
                        _this.quillEditor.updateContents(remoteDelta.delta, 'remote');
                    }
                    _this.deltaQueue = null;
                }
                _this.quillEditor.enable();
            }
        });
    };
    BoardService.prototype.clearAndLogout = function () {
        this.authenticationService.logout();
        this.board = null;
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }
    };
    BoardService.prototype.unfocusQuillEditor = function () {
        this.quillEditor.blur();
    };
    BoardService.prototype.isMaster = function () {
        return this.board.textDocument.master;
    };
    BoardService.prototype.setMaster = function (value) {
        this.board.textDocument.master = value;
    };
    BoardService.prototype.connectToServer = function (roomId) {
        var _this = this;
        var user = this.authenticationService.getClaims();
        this.socket = io(GenericConstants.BASE_SOCKET_URL, {
            reconnection: true,
            query: {
                roomId: roomId,
                assignedUserColor: user.assignedUserColor,
                email: user.email
            }
        });
        this.socket.on('connect', function () {
            var roomUsers = new RoomUsers();
            roomUsers.addUser(user);
            _this.board.textDocument.roomUsers = roomUsers;
            console.log(roomUsers);
            _this.updateRoomUsers.next(roomUsers);
        });
        this.socket.on('newArrival', function (newArrival) {
            _this.board.textDocument.addRoomUser(new User(newArrival.email, newArrival.assignedUserColor));
            console.log('newArrival ', newArrival.email);
        });
        this.socket.on('someoneLeft', function (data) {
            var roomUsers = _this.board.textDocument.roomUsers.getUsers();
            var index = -1;
            for (var i = 0; i < roomUsers.length; i++) {
                console.log(roomUsers[i].email);
                if (roomUsers[i].email === data.email) {
                    index = i;
                }
            }
            if (index > -1) {
                roomUsers.splice(index, index);
            }
            console.log('someone left ', data.email);
            _this.updateRoomUsers.next(_this.board.textDocument.roomUsers);
        });
        this.socket.on('roomiesListEvent', function (data) {
            for (var i = 0; i < data.roomies.length; i++) {
                var user = new User(data.roomies[i].email, data.roomies[i].assignedUserColor);
                _this.board.textDocument.addRoomUser(user);
            }
            _this.updateRoomUsers.next(_this.board.textDocument.roomUsers);
            console.log('roomies ', data);
        });
        this.socket.on('masterAssignEvent', function () {
            _this.setMaster(true);
            //if it's not updated
            console.log('length', _this.quillEditor.getText().trim().length);
            if (_this.quillEditor.getText().trim().length === 0) {
                _this.updateQuillFromTextDocument();
            }
            _this.deltaQueue = null;
            console.log('master ', user.email);
        });
        this.socket.on('noobSyncRequestEvent', function (data) {
            console.log('noobSyncRequestEvent', _this.isMaster());
            if (_this.isMaster()) {
                _this.socket.emit('contentSyncEvent', {
                    socketId: data.socketId,
                    content: _this.quillEditor.getContents(),
                    timestamp: Date.parse(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
                });
            }
        });
        this.socket.on('contentSyncEvent', function (data) {
            console.log(data.content);
            _this.quillEditor.setContents(data.content, 'initial');
        });
        this.socket.on('deltaSyncEvent', function (data) {
            if (_this.deltaQueue) {
                _this.deltaQueue.push(new RemoteDelta(data.delta, data.timestamp));
            }
            else {
                _this.quillEditor.updateContents(data.delta, 'remote');
            }
        });
    };
    return BoardService;
}());
BoardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HadronHttp,
        AuthenticationService,
        Uploader])
], BoardService);
export { BoardService };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/board-zone/board/board.service.js.map