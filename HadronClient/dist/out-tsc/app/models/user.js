var User = (function () {
    function User(email, assignedUserColor) {
        this._email = email;
        this._assignedUserColor = assignedUserColor;
    }
    Object.defineProperty(User.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (email) {
            this._email = email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "assignedUserColor", {
        get: function () {
            return this._assignedUserColor;
        },
        set: function (assignedUserColor) {
            this._assignedUserColor = assignedUserColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "roadMap", {
        get: function () {
            return this._roadMap;
        },
        set: function (roadMap) {
            this._roadMap = roadMap;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
export { User };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/user.js.map