var express     =  require('express'),
        bodyParser  =  require('body-parser'),
        app         =  express(),
        uuid = require('node-uuid');

        
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));

    require('./cors-filter')(app);


    var http = require('http').createServer(app).listen(8081, function(){
      console.log("Express server listening on port 8081);
    });

    var socketio = require('socket.io')(http);

    var getRoomUsers = function(roomId) {
        return socketio.sockets.adapter.rooms[roomID];
    };

    var getUsersInfoExceptFor = function(socketId, roomId) {
        var user = getRoomUsers(roomId);
        var usersInfo = [];
        var keys = [];
        for(var k in users.sockets){ keys.push(k) };
        for(var i=0;i<keys.length;i++) {
            usersInfo.push(socketio.sockets.connected[keys[i]].userInfo);
        }
        return usersInfo;
    }

    socketio.on('connection', function (socket) {
        var userInfo = socket.handshake.query;

        socket.on('message', function (message) {
            if(message.joinEvent) {
                socket.join(roomId);
                if(getRoomUsers(message.roomId).length === 1) {
                    userInfo.isMaster = true;
                    socket.userInfo = userInfo;
                    socket.emit('masterAssignEvent');
                } else {
                    socket.broadcast.to(message.roomId).emit('noobSyncRequestEvent', {socketId: socket.id, userInfo: userInfo});
                    socket.to(roomId).emit('roomiesListEvent' , {
                        roomies: getUsersInfoExcept(socket.id, message.roomId)
                    });
                }
            }
            if(message.leaveEvent) {
                socket.leave(message.roomId);
                var users = getRoomUsers();
                if(socket.isMaster && users.length !== 0) {
                    var rand = Math.floor(Math.random() * users.length);
                    var socket = socketio.sockets.connected[users.sockets[rand]];
                    socket.userInfo.isMaster = true;
                    socket.emit('masterAssignEvent');
                }
            }
            if(message.contentSyncEvent) {
                socketio.sockets.connected[message.socketId].to(message.roomId).emit('contentSyncEvent': {
                    content: message.content
                });
            }
            if(message.deltaSyncEvent) {
                socket.broadcast.to(message.roomId).emit('deltaSyncEvent', {delta: message.delta, timestamp: message.timestamp});
            }

            if(message.titleSyncEvent) {
                socket.broadcast.to(message.roomId).emit('titleSyncEvent', {title: message.title});
            }

        });

        socket.on('disconnect', function() {
        });
    });
