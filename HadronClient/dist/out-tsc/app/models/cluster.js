var Cluster = (function () {
    function Cluster() {
    }
    Cluster.prototype.Cluster = function (id) {
        this._id = id;
    };
    Object.defineProperty(Cluster.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cluster.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (color) {
            this._color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cluster.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (label) {
            this._label = label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cluster.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    return Cluster;
}());
export { Cluster };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/cluster.js.map