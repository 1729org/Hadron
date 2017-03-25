import { Injectable } from '@angular/core';
import { Board } from '../../models/board';
import { BoardSignature} from '../../models/board-signature';
import { AuthenticationService } from '../../authentication-zone/app-authentication/authentication.service';
import { GenericConstants } from '../../generics/generics.constants';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { BoardConstants } from './board.constants';
import { URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import * as io from 'socket.io-client';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
	private board :Board;
	private quillEditor :any;
	private quillBuffer :Array<any>;
	private saveTimerId :any;
	private lastModifiedTime :number;

	private logout = new Subject<boolean>();
	logout$ = this.logout.asObservable();

	constructor(private hadronHttp :HadronHttp,
		private authenticationService: AuthenticationService) {
		hadronHttp.logout$.subscribe(logout => {
			if(logout) {
				this.clearAndLogout();
				this.logout.next(true);
			}
	    });
	    this.quillBuffer = [];
	}

	createBoard(name :string) {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.CREATE_BOARD_URL}`, { name })
        .map((response :Response) => {
        	this.board = Tools.mapToBoard(response.json());
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	createTextDocument(name :string) {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.CREATE_TEXT_DOCUMENT_URL}`, { 
        	ownerEmail: this.board.ownerEmail,
        	boardName: this.board.name,
        	textDocumentName: name
         })
        .map((response :Response) => {
        	this.board.textDocument = Tools.mapToTextDocument(response.json());
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getLastModifiedBoard() {
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.GET_LAST_MODIFIED_BOARD_URL}`)
        .map((response :Response) => {
        	this.board = Tools.mapToBoard(response.json());
        	console.log(this.board.textDocument.content);
        	this.updateQuillFromTextDocument();
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getMembers() {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.GET_BOARD_MEMBERS_URL}`, {
        	boardName: this.board.name
        })
        .map((response :Response) => {
			return response.json() || {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	shareBoard(email) {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.SHARE_BOARD_URL}`, {
        	shareEmail: email,
        	boardName: this.board.name
        })
        .map((response :Response) => {
			return response.json() || {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	changeBoardName(newBoardName :string) {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.CHANGE_BOARD_NAME_URL}`, {
        	ownerEmail: this.board.ownerEmail,
        	boardName: this.board.name,
        	newBoardName: newBoardName
         })
        .map((response :Response) => {
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	changeTextDocumentName(newTextDocumentName :string) {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.CHANGE_TEXT_DOCUMENT_NAME_URL}`, {
        	boardName: this.board.name,
        	ownerEmail: this.board.ownerEmail,
        	textDocumentName: this.board.textDocument.name,
        	newTextDocumentName: newTextDocumentName
         })
        .map((response :Response) => {
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getBoard(ownerEmail :string, boardName :string) {
		if(this.saveTimerId) {
			clearInterval(this.saveTimerId);
			this.saveTimerId = null;
			this.lastModifiedTime = null;
		}
		this.saveTextDocumentContent()
		.subscribe(data =>{},error=>{});
		/*let params: URLSearchParams = new URLSearchParams();
	    params.set('name', name);*/
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.GET_BOARD_BY_NAME_URL}`, {
        	ownerEmail: ownerEmail,
        	boardName: boardName
        })
        .map((response :Response) => {
        	this.board = Tools.mapToBoard(response.json());
        	this.updateQuillFromTextDocument();
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	hasBoard() :boolean{
		return this.board != null;
	}

	isOwner() :boolean {
		return this.authenticationService.getClaims().email === this.board.ownerEmail;
	}

	getOwnerEmail() {
		return this.board.ownerEmail;
	}

	getCurrentBoardName() :string{
		return this.board.name;
	}

	getCurrentTextDocumentName() {
		return this.board.textDocument.name;
	}

	getBoardList() {
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.LIST_BOARDS_URL}`)
        .map((response :Response) => {
        	let  boardList = Tools.mapToBoardList(response.json());
			return boardList || {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getTextDocumentList() {
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.LIST_TEXT_DOCUMENTS_URL}`, {
        	boardName: this.board.name
        })
        .map((response :Response) => {
        	let  textDocumentList = Tools.mapToBoardList(response.json());
			return textDocumentList || {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getTextDocument(ownerEmail, name) {
		if(this.saveTimerId) {
			clearInterval(this.saveTimerId);
			this.saveTimerId = null;
			this.lastModifiedTime = null;
		}
		this.saveTextDocumentContent()
		.subscribe(data =>{},error=>{});
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.GET_TEXT_DOCUMENT_BY_NAME_URL}`, {
        	ownerEmail: ownerEmail,
        	boardName: this.board.name,
        	textDocumentName: name
        })
        .map((response :Response) => {
        	let  textDocument = Tools.mapToTextDocument(response.json());
        	this.board.textDocument = textDocument;
        	this.updateQuillFromTextDocument();
			return textDocument || {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	updateQuillFromTextDocument() {
		if(this.board && this.board.textDocument && this.board.textDocument.content && this.quillEditor) {
			this.quillEditor.setContents(this.board.textDocument.content, 'initial');
		}
	}

	setBoard(board :Board) :void{
		this.board = board;
		this.updateQuillFromTextDocument();
	}

	saveTextDocumentContent() {
		console.log('saving');
		return this.hadronHttp
        .post(`${GenericConstants.BASE_URL}${BoardConstants.SAVE_TEXT_DOCUMENT_URL}`, {
        	ownerEmail: this.board.ownerEmail,
        	boardName: this.board.name,
        	textDocumentName: this.board.textDocument.name,
        	delta: this.quillEditor.getContents()
        })
        .map((response :Response) => {
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	setQuillEditor(quillEditor :any) :void {
		this.quillEditor = quillEditor;
		this.updateQuillFromTextDocument();
		this.quillEditor.on('text-change', (newDelta, oldDelta, source) => {
			console.log(newDelta);
	  	  this.lastModifiedTime = Date.now();
 		  if(source !== 'initial') {
		  	if(!this.saveTimerId) {
		  		this.saveTimerId = setInterval(() => {
				  	if(Date.now() - this.lastModifiedTime > (BoardConstants.IDLE_INTERVAL * 1000)) {
				  		clearInterval(this.saveTimerId);
				  		this.saveTimerId = null;
				  	}
		  			this.saveTextDocumentContent().subscribe(data=>{},error=>{});
		  		}, BoardConstants.QUILL_SAVE_INTERVAL * 1000);
		  	}
		  }
		});
	}

	clearAndLogout() :void{
		this.authenticationService.logout();
		this.board = null;
	}
}