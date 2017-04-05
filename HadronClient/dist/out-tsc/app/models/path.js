var Path = (function () {
    function Path() {
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
    Object.defineProperty(Path.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (path) {
            this._path = path;
        },
        enumerable: true,
        configurable: true
    });
    return Path;
}());
export { Path };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/path.js.map