var RoomUsers = (function () {
    function RoomUsers() {
        this._users = [];
    }
    RoomUsers.prototype.addUser = function (user) {
        this._users.push(user);
    };
    RoomUsers.prototype.getUsers = function () {
        return this._users;
    };
    return RoomUsers;
}());
export { RoomUsers };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/room-users.js.map