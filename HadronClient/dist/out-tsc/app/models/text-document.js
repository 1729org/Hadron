var TextDocument = (function () {
    function TextDocument(name) {
        this._name = name;
    }
    Object.defineProperty(TextDocument.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextDocument.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (content) {
            this._content = content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextDocument.prototype, "roomId", {
        get: function () {
            return this._roomId;
        },
        set: function (roomId) {
            this._roomId = roomId;
        },
        enumerable: true,
        configurable: true
    });
    return TextDocument;
}());
export { TextDocument };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/text-document.js.map