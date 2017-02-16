import { TextDocument } from '../models/text-document';
import { User } from '../models/user';
import { Path } from '../models/path';
import { GraphicDocument } from '../models/graphic-document';
import { Collaboration } from '../models/collaboration';
import { Board } from '../models/board';
var Tools = (function () {
    function Tools() {
    }
    Tools.mapToBoard = function (data) {
        if (!data.board) {
            return null;
        }
        else {
            var boardInst = new Board(data.board.name, new Date(data.board.lastModifiedDate));
            boardInst.textDocument = Tools.mapToTextDocument(data.board.textDocument);
            boardInst.graphicDocument = Tools.mapToGraphicDocument(data.board.graphicDocument);
            boardInst.collaboration = Tools.mapToCollaboration(data.board.collaboration);
            return boardInst;
        }
    };
    Tools.mapToTextDocument = function (data) {
        if (!data) {
            return null;
        }
        else {
            var textDocument = new TextDocument(data.name, data.lastModifiedDate);
            if (data.content) {
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
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/generics/generics.tools.js.map