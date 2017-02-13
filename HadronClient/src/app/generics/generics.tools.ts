import { Board } from '../models/board';
import { TextDocument } from '../models/text-document';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Collaboration } from '../models/collaboration';
import { User } from '../models/user';

export class Tools {
	public static mapToBoard(data: any) :Board {
		if(!data.boards) {
        		return null;
    	} else {
    		let boards = [];
    		for(let board of data.boards) {
    			let boardInst = new Board(board.name, 
                    new Date(board.lastModifiedDate));
                boardInst.textDocument = Tools.mapToTextDocument(board.textDocument);
    			boardInst.graphicDocument = Tools.mapToGraphicDocument(board.graphicDocument);
    		}
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

export abstract class Comparable <T>{
	abstract compareTo(object :T) :number;
}

export class PriorityQueue <T extends Comparable<T>>{
	private queue :Array<T>;

	constructor() {
		this.queue = [];
	}

	public push(object :T) {
		this.queue.push(object);
		this.sortArray(this.queue);
	}

	public pop() :T {
		return this.queue.pop();
	}

	public peek() :T {
		return this.queue[this.queue.length - 1];
	}

	public isEmpty() :boolean {
		return this.queue.length === 0;
	}

	public mergeWithQueueAsArray(priorityQueue :PriorityQueue<T>) :Array<T>{
		return this.mergeWithArrayAsArray(priorityQueue.asArray());
	}

	public mergeWithArrayAsArray(array :Array<T>) :Array<T>{
		let mergedArray = this.queue.concat(array);
		this.sortArray(mergedArray);
		return mergedArray;
	}

	public asArray() :Array<T> {
		return this.queue;
	}

	private sortArray(array: Array<T>) :void{
		array.sort(function(firstObject :T, secondObject :T) {
			return firstObject.compareTo(secondObject);
		});
	}
}