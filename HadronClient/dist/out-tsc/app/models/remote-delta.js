var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Comparable } from './comparable';
var RemoteDelta = (function (_super) {
    __extends(RemoteDelta, _super);
    function RemoteDelta(delta, timestamp) {
        var _this = _super.call(this) || this;
        _this._delta = delta;
        _this._timestamp = timestamp;
        return _this;
    }
    Object.defineProperty(RemoteDelta.prototype, "delta", {
        get: function () {
            return this._delta;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteDelta.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        enumerable: true,
        configurable: true
    });
    RemoteDelta.prototype.compareTo = function (object) {
        return this._timestamp - object.timestamp;
    };
    return RemoteDelta;
}(Comparable));
export { RemoteDelta };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/remote-delta.js.map