var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { UploadItem } from 'angular2-http-file-upload';
import { GenericConstants } from '../generics/generics.constants';
import { BoardConstants } from '../board-zone/board/board.constants';
var QuillUpload = (function (_super) {
    __extends(QuillUpload, _super);
    function QuillUpload(file) {
        var _this = _super.call(this) || this;
        _this.url = "" + GenericConstants.BASE_URL + BoardConstants.UPLOAD_URL;
        _this.file = file;
        return _this;
    }
    return QuillUpload;
}(UploadItem));
export { QuillUpload };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/models/quill-upload.js.map