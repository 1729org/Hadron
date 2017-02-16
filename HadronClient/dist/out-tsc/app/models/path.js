var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Comparable } from '../models/comparable';
var Path = (function (_super) {
    __extends(Path, _super);
    function Path() {
        var _this = _super.call(this) || this;
        _this._points = [];
        return _this;
    }
    Object.defineProperty(Path.prototype, "colorStroke", {
        get: function () {
            return this._colorStroke;
        },
        set: function (colorStroke) {
            this._colorStroke = colorStroke;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "brushSize", {
        get: function () {
            return this._brushSize;
        },
        set: function (brushSize) {
            this._brushSize = brushSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "points", {
        set: function (points) {
            this._points = points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "closedTimestamp", {
        get: function () {
            return this._closedTimestamp;
        },
        set: function (closedTimestamp) {
            this._closedTimestamp = closedTimestamp;
        },
        enumerable: true,
        configurable: true
    });
    Path.prototype.add = function (point) {
        this._points.push(point);
    };
    Path.prototype.get = function (index) {
        return this._points[index];
    };
    Path.prototype.close = function () {
        this._closedTimestamp = Date.now();
    };
    Path.prototype.size = function () {
        return this._points.length;
    };
    Path.prototype.compareTo = function (path) {
        return this._closedTimestamp - path.closedTimestamp;
    };
    return Path;
}(Comparable));
export { Path };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/models/path.js.map