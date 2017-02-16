var Board = (function () {
    function Board(name, lastModifiedDate) {
        this._name = name;
        this._lastModifiedDate = lastModifiedDate;
    }
    Object.defineProperty(Board.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "textDocument", {
        get: function () {
            return this._textDocument;
        },
        set: function (textDocument) {
            this._textDocument = textDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "graphicDocument", {
        get: function () {
            return this._graphicDocument;
        },
        set: function (graphicDocument) {
            this._graphicDocument = graphicDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "collaboration", {
        get: function () {
            return this._collaboration;
        },
        set: function (collaboration) {
            this._collaboration = collaboration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "lastModifiedDate", {
        get: function () {
            return this.lastModifiedDate;
        },
        set: function (lastModifiedDate) {
            this._lastModifiedDate = lastModifiedDate;
        },
        enumerable: true,
        configurable: true
    });
    return Board;
}());
export { Board };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/models/board.js.map