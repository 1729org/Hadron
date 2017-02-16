import { PriorityQueue } from './priority-queue';
var GraphicDocument = (function () {
    function GraphicDocument(name, lastModifiedDate) {
        this._name = name;
        this._content = new PriorityQueue();
        this._lastModifiedDate = lastModifiedDate;
    }
    Object.defineProperty(GraphicDocument.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    GraphicDocument.prototype.pushToContent = function (path) {
        this._content.push(path);
    };
    Object.defineProperty(GraphicDocument.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicDocument.prototype, "lastModifiedDate", {
        get: function () {
            return this._lastModifiedDate;
        },
        set: function (lastModifiedDate) {
            this._lastModifiedDate = lastModifiedDate;
        },
        enumerable: true,
        configurable: true
    });
    return GraphicDocument;
}());
export { GraphicDocument };
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/models/graphic-document.js.map