import { TextDocument } from '../models/text-document';
import { User } from '../models/user';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Collaboration } from '../models/collaboration';
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
			let boardInst = new Board(data.name, data.ownerEmail);
                boardInst.textDocument = Tools.mapToTextDocument(data.textDocument);
    			boardInst.graphicDocument = Tools.mapToGraphicDocument(data.graphicDocument);
    			boardInst.collaboration = Tools.mapToCollaboration(data.collaboration);
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

	public static mapToGraphicDocument(data :any) :GraphicDocument {
		if(!data) {
			return null;
		} else {
			let graphicDocument = new GraphicDocument(data.name, data.lastModifiedDate);
			if(data.content) {
				for(let path of data.content) {
					let pathInst = new Path();
					pathInst.brushSize = path.brushSize;
					pathInst.colorStroke = path.colorStroke;
					pathInst.points = path.points;
					pathInst.closedTimestamp = path.closedTimestamp;
					graphicDocument.pushToContent(path);
				}
			}
			return graphicDocument;
		}
	}

	public static mapToCollaboration(data :any) :Collaboration {
		if(!data) {
			return null;
		} else {
			let collaboration = new Collaboration(data.roomId);
			for(let user of data.users) {
				collaboration.pushUser(new User(user.email, user.assignedUserColor));
			}
		}
	}
}
