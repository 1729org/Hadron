import { TextDocument } from '../models/text-document';
import { User } from '../models/user';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Collaboration } from '../models/collaboration';
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
            var boardInst = new Board(data.name, data.ownerEmail);
            boardInst.textDocument = Tools.mapToTextDocument(data.textDocument);
            boardInst.graphicDocument = Tools.mapToGraphicDocument(data.graphicDocument);
            boardInst.collaboration = Tools.mapToCollaboration(data.collaboration);
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
    Tools.mapToGraphicDocument = function (data) {
        if (!data) {
            return null;
        }
        else {
            var graphicDocument = new GraphicDocument(data.name, data.lastModifiedDate);
            if (data.content) {
                for (var _i = 0, _a = data.content; _i < _a.length; _i++) {
                    var path = _a[_i];
                    var pathInst = new Path();
                    pathInst.brushSize = path.brushSize;
                    pathInst.colorStroke = path.colorStroke;
                    pathInst.points = path.points;
                    pathInst.closedTimestamp = path.closedTimestamp;
                    graphicDocument.pushToContent(path);
                }
            }
            return graphicDocument;
        }
    };
    Tools.mapToCollaboration = function (data) {
        if (!data) {
            return null;
        }
        else {
            var collaboration = new Collaboration(data.roomId);
            for (var _i = 0, _a = data.users; _i < _a.length; _i++) {
                var user = _a[_i];
                collaboration.pushUser(new User(user.email, user.assignedUserColor));
            }
        }
    };
    return Tools;
}());
export { Tools };
//# sourceMappingURL=C:/Old/Hadron/HadronClient/src/app/generics/generics.tools.js.map