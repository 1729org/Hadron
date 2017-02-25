var Collaboration = (function () {
    function Collaboration(roomId) {
        this._users = [];
        this._roomId = roomId;
    }
    Collaboration.prototype.pushUser = function (user) {
        this._users.push(user);
    };
    Object.defineProperty(Collaboration.prototype, "users", {
        get: function () {
            return this._users;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collaboration.prototype, "roomId", {
        get: function () {
            return this._roomId;
        },
        set: function (roomId) {
            this._roomId = roomId;
        },
        enumerable: true,
        configurable: true
    });
    return Collaboration;
}());
export { Collaboration };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/collaboration.js.map