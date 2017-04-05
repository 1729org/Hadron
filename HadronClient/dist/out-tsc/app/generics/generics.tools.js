import { TextDocument } from '../models/text-document';
import { Board } from '../models/board';
import { BoardSignature } from '../models/board-signature';
var Tools = (function () {
    function Tools() {
    }
    Tools.mapToBoardList = function (data) {
        if (!data) {
            return null;
        }
        else {
            var boardList = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var boardSignature = data_1[_i];
                boardList.push(new BoardSignature(boardSignature.name, boardSignature.ownerEmail, boardSignature.isShared));
            }
            return boardList;
        }
    };
    Tools.mapToBoard = function (data) {
        console.log(data);
        if (!data) {
            return null;
        }
        else {
            var boardInst = new Board(data.id, data.name, data.ownerEmail);
            boardInst.textDocument = Tools.mapToTextDocument(data.textDocument);
            boardInst.isShared = data.shared.userIds.length > 0;
            console.log(boardInst.isShared);
            return boardInst;
        }
    };
    Tools.mapToTextDocument = function (data) {
        console.log(data);
        if (!data) {
            return null;
        }
        else {
            var textDocument = new TextDocument(data.name);
            if (data.roomId) {
                textDocument.roomId = data.roomId;
            }
            if (data.content) {
                console.log('has content');
                textDocument.content = data.content;
            }
            return textDocument;
        }
    };
    return Tools;
}());
export { Tools };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/generics/generics.tools.js.map