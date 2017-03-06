var RoadMap = (function () {
    function RoadMap() {
    }
    RoadMap.prototype.RoadMap = function (nodes, edges) {
        this._nodes = nodes;
        this._edges = edges;
    };
    Object.defineProperty(RoadMap.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        set: function (nodes) {
            this._nodes = nodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoadMap.prototype, "edges", {
        get: function () {
            return this._edges;
        },
        set: function (edges) {
            this._edges = edges;
        },
        enumerable: true,
        configurable: true
    });
    return RoadMap;
}());
export { RoadMap };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/road-map.js.map