var File = (function () {
    function File() {
    }
    File.prototype.contructor = function (name, size, uploadedDate) {
        this._name = name;
        this._size = size;
        this._uploadedDate = uploadedDate;
    };
    Object.defineProperty(File.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (size) {
            this._size = size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "uploadedDate", {
        get: function () {
            return this._uploadedDate;
        },
        set: function (uploadedDate) {
            this._uploadedDate = uploadedDate;
        },
        enumerable: true,
        configurable: true
    });
    return File;
}());
export { File };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/file.js.map