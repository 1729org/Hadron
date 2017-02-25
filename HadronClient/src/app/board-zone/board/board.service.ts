import { Injectable } from '@angular/core';
import { Board } from '../../models/board';
import { BoardSignature} from '../../models/board-signature';
import { GenericConstants } from '../../generics/generics.constants';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HadronHttp } from '../../generics/generics.interceptor';
import { Tools } from '../../generics/generics.tools';
import { BoardConstants } from './board.constants';
import { URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
	private board :Board;
	private boardList :Array<BoardSignature>;

	constructor(private hadronHttp :HadronHttp) {
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

	getLastModifiedBoard() {
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.GET_LAST_MODIFIED_BOARD_URL}`, )
        .map((response :Response) => {
        	console.log(response.json());
        	this.board = Tools.mapToBoard(response.json());
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	getBoard(name :string) {
		let params: URLSearchParams = new URLSearchParams();
	    params.set('name', name);
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.GET_BOARD_BY_NAME_URL}`, {
        	search: params
        })
        .map((response :Response) => {
        	this.board = Tools.mapToBoard(response.json());
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	hasBoard() {
		return this.board != null;
	}

	getCurrentBoardName() {
		return this.board.name;
	}

	getBoardList() {
		return this.hadronHttp
        .get(`${GenericConstants.BASE_URL}${BoardConstants.LIST_BOARDS_URL}`)
        .map((response :Response) => {
        	this.boardList = Tools.mapToBoardList(response.json().data);
			return {};
        })
        .catch((error :Response | any) => {
			return Observable.throw(error);
        });
	}

	setBoard(board :Board) {
		this.board = board;
	}
}