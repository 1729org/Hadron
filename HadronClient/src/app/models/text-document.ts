export class TextDocument {
	private _name :string;
	private _content :any;
	private _roomId :string;

	constructor(name :string) {
		this._name = name;
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

	set roomId(roomId :string) {
		this._roomId = roomId;
	}

	get roomId() :string {
		return this._roomId;
	}
}