var Node = (function () {
    function Node() {
    }
    Node.prototype.Node = function (id) {
        this._id = id;
    };
    Object.defineProperty(Node.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (label) {
            this._label = label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    return Node;
}());
export { Node };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/node.js.map