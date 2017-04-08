import { GenericConstants } from '../generics/generics.constants';
var CanvasFile = (function () {
    function CanvasFile() {
    }
    CanvasFile.prototype.contructor = function (name, size, uploadedDate) {
        this._name = name;
        this._size = size;
        this._uploadedDate = uploadedDate;
    };
    Object.defineProperty(CanvasFile.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasFile.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            this._size = size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasFile.prototype, "uploadedDate", {
        get: function () {
            return this._uploadedDate;
        },
        set: function (uploadedDate) {
            this._uploadedDate = uploadedDate;
        },
        enumerable: true,
        configurable: true
    });
    CanvasFile.prototype.buildUrl = function () {
        this._url = "" + GenericConstants.BASE_FILE_URL + this._name + ".png";
    };
    Object.defineProperty(CanvasFile.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    return CanvasFile;
}());
export { CanvasFile };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/canvas-file.js.map