var GraphicDocument = (function () {
    function GraphicDocument() {
        this._content = [];
    }
    GraphicDocument.prototype.peekAtPath = function () {
        return this._content[this._content.length - 1];
    };
    GraphicDocument.prototype.popFromContent = function () {
        if (this._content.length !== 0) {
            this._content.pop();
        }
    };
    GraphicDocument.prototype.pushToContent = function (path) {
        this._content.push(path);
    };
    GraphicDocument.prototype.clearContent = function () {
        this._content = [];
    };
    Object.defineProperty(GraphicDocument.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    return GraphicDocument;
}());
export { GraphicDocument };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/graphic-document.js.map