export class BoardSignature {
	private _name :string;
	private _isShared :boolean;

	constructor(name :string, isShared :boolean) {
		this._name = name;
		this._isShared = isShared;
	}

	get name() :string {
		return this._name;
	}

	set name(name : string) {
		this._name = name;
	}

	get isShared() :boolean {
		return this._isShared;
	}

	set isShared(isShared :boolean) {
		this._isShared = isShared;
	}
}