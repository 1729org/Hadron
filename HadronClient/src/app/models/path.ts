import { Comparable } from './comparable';

export class Path extends Comparable<Path>{
	private _colorStroke :string;
	private _brushSize :string;
	private _points :Array<[number, number]>;
	private _closedTimestamp :number;

	constructor() {
		super();
		this._points = [];
	}

	set colorStroke(colorStroke :string) {
		this._colorStroke = colorStroke;
	}

	get colorStroke() :string {
		return this._colorStroke;
	}

	set brushSize(brushSize :string) {
		this._brushSize = brushSize;
	}

	get brushSize() :string {
		return this._brushSize;
	}

	set points(points :Array<[number, number]>) {
		this._points = points;
	}

	set closedTimestamp(closedTimestamp :number) {
		this._closedTimestamp = closedTimestamp;
	}

	get closedTimestamp() :number {
		return this._closedTimestamp;
	}

	public add(point :[number, number]) {
		this._points.push(point);
	}

	public get(index :number) :[number, number] {
		return this._points[index];
	}

	public close() {
		this._closedTimestamp = Date.now();
	}

	public size() :number {
		return this._points.length;
	}

	public compareTo(path :Path) :number{
		return this._closedTimestamp - path.closedTimestamp;
	}
}