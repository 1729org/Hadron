import { TextDocument } from './text-document';
import { GraphicDocument } from './graphic-document';
import { Collaboration } from './collaboration';

export class Board {
	private _name :string;
	private _textDocument :TextDocument;
	private _graphicDocument :GraphicDocument;
	private _collaboration :Collaboration;
	private _lastModifiedDate :Date;

	constructor(name :string, lastModifiedDate :Date) {
		this._name = name;
		this._lastModifiedDate = lastModifiedDate;
	}

	set name(name :string) {
		this._name = name;
	}

	get name() :string {
		return this._name;
	}

	set textDocument(textDocument :TextDocument) {
		this._textDocument = textDocument;
	}

	get textDocument() :TextDocument {
		return this._textDocument;
	}

	set graphicDocument(graphicDocument :GraphicDocument) {
		this._graphicDocument = graphicDocument;
	}

	get graphicDocument() :GraphicDocument {
		return this._graphicDocument;
	}

	set collaboration(collaboration :Collaboration) {
		this._collaboration = collaboration;
	}

	get collaboration() :Collaboration {
		return this._collaboration;
	}

	set lastModifiedDate(lastModifiedDate :Date) {
		this._lastModifiedDate = lastModifiedDate;
	}

	get lastModifiedDate() :Date {
		return this.lastModifiedDate;
	}
}