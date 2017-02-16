import { TextDocument } from '../models/text-document';
import { User } from '../models/user';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Collaboration } from '../models/collaboration';
import { Board } from '../models/board';



export class Tools {
	public static mapToBoard(data: any) :Board {
		if(!data.board) {
        		return null;
    	} else {
			let boardInst = new Board(data.board.name, 
                new Date(data.board.lastModifiedDate));
                boardInst.textDocument = Tools.mapToTextDocument(data.board.textDocument);
    			boardInst.graphicDocument = Tools.mapToGraphicDocument(data.board.graphicDocument);
    			boardInst.collaboration = Tools.mapToCollaboration(data.board.collaboration);
    		return boardInst;
    	}
	}

	public static mapToTextDocument(data :any) :TextDocument {
		if(!data) {
			return null;
		} else {
			let textDocument = new TextDocument(data.name, data.lastModifiedDate);
			if(data.content) {
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
