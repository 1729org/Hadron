import { TextDocument } from '../models/text-document';
import { User } from '../models/user';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Board } from '../models/board';
import { BoardSignature} from '../models/board-signature';


export class Tools {
	public static mapToBoardList(data :Array<any>) :Array<BoardSignature> {

		if(!data) {
			return null;
		} else {
			let boardList = [];
			for(let boardSignature of data) {
				boardList.push(new BoardSignature(boardSignature.name, boardSignature.ownerEmail, boardSignature.isShared));
			}
			return boardList;
		}
	}

	public static mapToBoard(data: any) :Board {
		console.log(data);
		if(!data) {
        		return null;
    	} else {
			let boardInst = new Board(data.id, data.name, data.ownerEmail);
                boardInst.textDocument = Tools.mapToTextDocument(data.textDocument);
    			boardInst.isShared = data.shared.userIds.length > 0;
    			console.log(boardInst.isShared);
    		return boardInst;
    	}
	}

	public static mapToTextDocument(data :any) :TextDocument {
		console.log(data);
		if(!data) {
			return null;
		} else {
			let textDocument = new TextDocument(data.name);
			if(data.roomId) {
				textDocument.roomId = data.roomId;
			}
			if(data.content) {
				console.log('has content');
				textDocument.content = data.content;
			}
			return textDocument;
		}
	}
}
