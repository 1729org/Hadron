var Board = (function () {
    function Board(name, ownerEmail) {
        this._name = name;
        this._ownerEmail = ownerEmail;
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
    Object.defineProperty(Board.prototype, "ownerEmail", {
        get: function () {
            return this.ownerEmail;
        },
        set: function (ownerEmail) {
            this._ownerEmail = ownerEmail;
        },
        enumerable: true,
        configurable: true
    });
    return Board;
}());
export { Board };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/board.js.map