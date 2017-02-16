import { Board } from '../models/board';

export class BoardService {
	private board :Board;

	public hasBoard() :boolean {
		return this.board != null;
	}
}