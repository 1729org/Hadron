var Board = (function () {
    function Board(id, name, ownerEmail) {
        this._id = id;
        this._name = name;
        this._ownerEmail = ownerEmail;
    }
    Object.defineProperty(Board.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(Board.prototype, "isShared", {
        get: function () {
            return this._isShared;
        },
        set: function (isShared) {
            this._isShared = isShared;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "ownerEmail", {
        get: function () {
            return this._ownerEmail;
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