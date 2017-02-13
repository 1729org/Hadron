import { User } from './user';

export class Collaboration {
	private _users :Array<User>;
	private _roomId :string;

	constructor(roomId) {
		this._users = [];
		this._roomId = roomId;
	}

	pushUser(user :User) {
		this._users.push(user);
	}

	get users() :Array<User> {
		return this._users;
	}

	set roomId(roomId :string) {
		this._roomId = roomId;
	}

	get roomId() :string {
		return this._roomId;
	}
}