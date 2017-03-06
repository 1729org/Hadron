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

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
	private board :Board;
	private quillEditor :any;
	private quillBuffer :Array<any>;
	private saveTimerId :any;

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
		console.log('lastmodif');
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.GET_LAST_MODIFIED_BOARD_URL}`)
        .map((response :Response) => {
        	console.log(response.json());
        	this.board = Tools.mapToBoard(response.json());
        	console.log(this.board);
        	this.updateQuillFromTextDocument();
			return {};
        })
        .catch((error :Response | any) => {
        	console.log(error);
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

	getCurrentBoardName() :string{
		return this.board.name;
	}

	getCurrentTextDocumentName() {
		console.log(this.board.textDocument.name);
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

	updateQuillFromTextDocument() {
		console.log(this.board);
		if(this.board && this.board.textDocument && this.board.textDocument.content && this.quillEditor) {
			this.quillEditor.updateContents(this.board.textDocument.content, 'initial');
			this.board.textDocument.content = null;
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
		  if(source !== 'initial') {
		  	if(!this.saveTimerId) {
		  		this.saveTimerId = setInterval(() => {
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