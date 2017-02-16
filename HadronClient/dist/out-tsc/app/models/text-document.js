var TextDocument = (function () {
    function TextDocument(name, lastModifiedDate) {
        this._name = name;
        this._lastModifiedDate = lastModifiedDate;
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
    Object.defineProperty(TextDocument.prototype, "lastModifiedDate", {
        get: function () {
            return this._lastModifiedDate;
        },
        set: function (lastModifiedDate) {
            this._lastModifiedDate = lastModifiedDate;
        },
        enumerable: true,
        configurable: true
    });
    return TextDocument;
}());
export { TextDocument };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/models/text-document.js.map