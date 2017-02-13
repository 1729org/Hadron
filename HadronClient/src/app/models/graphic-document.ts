import { Path } from './path';
import { PriorityQueue } from '../generics/generics.tools';

export class GraphicDocument {
	private _name :string;
	private _content :PriorityQueue<Path>;
	private _lastModifiedDate :Date;

	constructor(name :string, lastModifiedDate :Date) {
		this._name = name;
		this._content = new PriorityQueue<Path>();
		this._lastModifiedDate = lastModifiedDate;
	}

	set name(name :string) {
		this._name = name;
	}

	get name() :string {
		return this._name;
	}

	pushToContent(path :Path) {
		this._content.push(path);
	}

	get content() :PriorityQueue<Path> {
		return this._content;
	}

	set lastModifiedDate(lastModifiedDate :Date) {
		this._lastModifiedDate = lastModifiedDate;
	}

	get lastModifiedDate() :Date {
		return this._lastModifiedDate;
	}
}