import { TextDocument } from './text-document';
import { GraphicDocument } from './graphic-document';
import { Collaboration } from './collaboration';

export class Board {
	private _name :string;
	private _textDocument :TextDocument;
	private _graphicDocument :GraphicDocument;
	private _collaboration :Collaboration;
	private _ownerEmail :string;

	constructor(name :string, ownerEmail :string) {
		this._name = name;
		this._ownerEmail = ownerEmail;
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

	set ownerEmail(ownerEmail :string) {
		this._ownerEmail = ownerEmail;
	}

	get ownerEmail() :string {
		return this.ownerEmail;
	}
}