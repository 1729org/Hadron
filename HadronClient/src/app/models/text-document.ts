export class TextDocument {
	private _name :string;
	private _content :any;
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

	set content(content :any) {
		this._content = content;
	}

	get content() :any {
		return this._content;
	}

	set lastModifiedDate(lastModifiedDate :Date) {
		this._lastModifiedDate = lastModifiedDate;
	}

	get lastModifiedDate() :Date {
		return this._lastModifiedDate;
	}
}