var BoardSignature = (function () {
    function BoardSignature(name, isShared) {
        this._name = name;
        this._isShared = isShared;
    }
    Object.defineProperty(BoardSignature.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoardSignature.prototype, "isShared", {
        get: function () {
            return this._isShared;
        },
        set: function (isShared) {
            this._isShared = isShared;
        },
        enumerable: true,
        configurable: true
    });
    return BoardSignature;
}());
export { BoardSignature };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/board-signature.js.map