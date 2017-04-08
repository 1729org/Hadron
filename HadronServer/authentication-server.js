module.exports = function(db, application, genericConstants, tokenHandler) {
	var hadronUsersCollection = db.collection('hadronUsers');
  var multer  = require('multer')
	var ObjectId = require('mongodb').ObjectID;
	var uuidV4 = require('uuid/v4');
  var fs = require('fs');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {/*
      fs.existsSync(genericConstants.UPLOAD_DIR_BASE + data.email) || 
      fs.mkdirSync(genericConstants.UPLOAD_DIR_BASE + data.email);
      fs.existsSync(genericConstants.UPLOAD_DIR_BASE + data.email + '/' + data.boardId) || 
      fs.mkdirSync(genericConstants.UPLOAD_DIR_BASE + data.email + '/' + data.boardId);*/
      cb(null, genericConstants.UPLOAD_DIR_BASE);
    },
    filename: function (req, file, cb) {
      console.log('in filename');
      var data = req.body;
      var now = Date.now();
      var fileName = uuidV4() + '_' + now;
      var fileDoc = {
        name: fileName,
        uploadedDate: now,
        size: file.size
      };
      db.eval('function(email, boardId, fileDoc){ var document = db.hadronUsers.findOne({email:email}); if(document == null) return; for(var i=0;i<document.boards.length;i++){if(document.boards[i].id === boardId){document.boards[i].files.push(fileDoc); db.hadronUsers.save(document);}}}', [data.email, data.boardId, fileDoc]);
      cb(null, fileName + '.png');
    }
  });

  var upload = multer({ storage: storage });

	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

  application.post(genericConstants.UPLOAD_URL, upload.any(), function (req, res, next) {
    console.log(req.file);
    console.log(req.body);
    console.log('in upload handler');
    res.status(200).json({name: req.files[0].filename});
  });

  application.post(genericConstants.GET_FILES_FOR_BOARD_URL, function(req, res) {
    var data = req.body;
    var ownerEmail = data.ownerEmail;
    var boardName = data.boardName;

    db.eval('function(ownerEmail, boardName){ var document = db.hadronUsers.findOne({email:ownerEmail}); for(var i=0;i<document.boards.length;i++) { if(document.boards[i].name === boardName) { return document.files; } } }', [ownerEmail, boardName])
    .then(function(response) {
      res.status(200).json(response);
    })
    .catch(function(error) {
      res.status(500).json({message: error.message});
    });

  });

  application.get(genericConstants.GET_FILES_FOR_USER_URL, function(req, res) {
    var email = req.email;

    db.eval('function(email){ var document = db.hadronUsers.findOne({email:email}); var files = []; for(var i=0;i<document.boards.length;i++) { files = files.concat(document.boards[i].files);} return files; }', [email])
    .then(function(response) {
      res.status(200).json(response);
    })
    .catch(function(error) {
      res.status(500).json({message: error.message});
    });
  });

	application.get(genericConstants.LOGIN_URL, function(req, res) {
		var buffer = new Buffer(req.headers['authorization'], 'Base64');
		var email = buffer
					.toString();
		var randomColor = getRandomColor();
		hadronUsersCollection
		.findOne({email: email}, {fields: {email: 1}})
		.then(function(document) {
			if(!document) {
				hadronUsersCollection.insert({
					email: email,
					settings: {
						assignedUserColor: randomColor
					},
          roadMap: {
            clusters: [],
            nodes: [],
            edges: []
          },
					boards: []
				});
				res.writeHead(401, {'x-auth-token' : tokenHandler.generateToken({email: email, assignedUserColor: randomColor}) } );
				res.end();
			} else {
  				db.eval('function(email){  var document = db.hadronUsers.findOne({email: email}, {lastVisited: 1, settings: 1}); if(!document.lastVisited) {return null;} var lastVisited = db.hadronUsers.findOne({ $or: [{email: email, \'boards.name\': document.lastVisited.name}, {\'boards.shared.userIds\':{ $in : [email]}, \'boards.name\': document.lastVisited.name}] }); for(var k=0;k<lastVisited.boards.length;k++) { if(lastVisited.boards[k].name === document.lastVisited.name) { var board = lastVisited.boards[k]; for(var i=0; i< board.textDocuments.length;i++) { if(board.lastVisited.name == board.textDocuments[i].name) {board.textDocument = board.textDocuments[i]; board.ownerEmail = board.lastVisited.email; delete board.textDocuments; delete board.lastVisited; return { board: board, assignedUserColor: document.settings.assignedUserColor};}}}} return null;}', [email])
				.then(function(response) {
					if(!response) {
						res.writeHead(401, {'x-auth-token' : tokenHandler.generateToken({email: email, assignedUserColor: randomColor}) } );
						return res.end();
					}
          console.log(response.assignedUserColor);
					res.setHeader('x-auth-token', tokenHandler.generateToken({email: email, assignedUserColor: response.assignedUserColor}));
					res.setHeader('Content-Type', 'application/json');
					res.json(response.board);
				})
				.catch(function(err){
					res.status(500).json({message: err.message});
				});
				
			}
		})
		.catch(function(err) {
			res.status(500).json({message: err.message});
		});
  	});

  	application.post(genericConstants.CHANGE_BOARD_NAME_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		var boardName = data.boardName;
  		var newBoardName = data.newBoardName;

  		db.eval('function(email, boardName, newBoardName){ var document = db.hadronUsers.findOne({email:email, \'boards.name\': newBoardName}, {email: 1}); if(document!= null){ return {saved: false};} document = db.hadronUsers.findOne({email:email}); for(var i=0;i<document.boards.length;i++){if(document.boards[i].name == boardName){ document.boards[i].name = newBoardName; if(document.lastVisited.name === boardName && document.lastVisited.email === email){document.lastVisited.name = newBoardName;} db.hadronUsers.save(document); return {saved:true};}} return {saved: false}; }', [email, boardName, newBoardName])
  		.then(function(response) {
  			if(response.saved) {
  				return res.status(200).json({});
  			} else {
  				return res.status(401).json({});
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.CHANGE_TEXT_DOCUMENT_NAME_URL, function(req, res) {
  		var data = req.body;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var textDocumentName = data.textDocumentName;
  		var newTextDocumentName = data.newTextDocumentName;


  		db.eval('function(ownerEmail, boardName, textDocumentName, newTextDocumentName){ var document = db.hadronUsers.findOne({email:ownerEmail, \'boards.textDocuments.name\': newTextDocumentName}, {email: 1}); if(document!= null){ return {saved: false};} document = db.hadronUsers.findOne({email:ownerEmail}); for(var i=0;i<document.boards.length;i++){if(document.boards[i].name == boardName){ var board = document.boards[i]; for(var j=0;j<board.textDocuments.length;j++){if(board.textDocuments[j].name === textDocumentName){document.boards[i].textDocuments[j].name = newTextDocumentName; if(board.lastVisited.name === textDocumentName && board.lastVisited.email === ownerEmail){ document.boards[i].lastVisited.name = newTextDocumentName;} db.hadronUsers.save(document); return {saved: true};}}}} return {saved: false}; }', [ownerEmail, boardName, textDocumentName, newTextDocumentName])
  		.then(function(response) {
  			if(response.saved) {
  				return res.status(200).json({});
  			} else {
  				return res.status(401).json({});
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

    application.post(genericConstants.GET_BOARD_MEMBERS_URL, function(req, res) {
      var data = req.body;
      var email = req.email;
      var boardName = data.boardName;
      console.log(email, boardName);
      hadronUsersCollection
      .findOne({email: email})
      .then(function(document) {
        for(var i=0;i<document.boards.length;i++) {
          var board = document.boards[i];
          if(board.name === boardName) {
           return res.status(200).json(board.shared);
          }
        }
        return res.status(401).json({});
      })
      .catch(function(err) {
        return res.status(500).json({message: err.message});
      })
    });

  	application.post(genericConstants.CREATE_TEXT_DOCUMENT_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var textDocumentName = data.textDocumentName;

      var roomId = uuidV4();
  		db.eval('function(email, ownerEmail, boardName, textDocumentName, roomId){ var document = db.hadronUsers.findOne({email: ownerEmail}); for(var i=0;i<document.boards.length;i++) {if(document.boards[i].name === boardName){for(var j=0;j<document.boards[i].textDocuments.length;j++){if(document.boards[i].textDocuments[j].name === textDocumentName){return null;}} var textDocument = {name: textDocumentName}; if(document.boards[i].shared && document.boards[i].shared.userIds.length !== 0) {textDocument.roomId = roomId + \'-\' + textDocumentName;} document.boards[i].textDocuments.push(textDocument); document.boards[i].lastVisited = {name: textDocumentName,email: ownerEmail}; db.hadronUsers.save(document); return textDocument;}} return null;}',[email, ownerEmail, boardName, textDocumentName, roomId])
  		.then(function(response) {
  			if(response) {
  				res.status(200).json(response);
  			} else {
  				res.status(401).json({});
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.SAVE_TEXT_DOCUMENT_URL , function(req, res) {
  		var data = req.body;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var textDocumentName = data.textDocumentName;
  		var delta = data.delta;

      db.eval('function(ownerEmail, boardName, textDocumentName, delta){var document = db.hadronUsers.findOne({email: ownerEmail}); for(var i=0;i<document.boards.length;i++){if(document.boards[i].name === boardName){var board = document.boards[i]; for(var j=0;j<board.textDocuments.length;j++){if(board.textDocuments[j].name === textDocumentName){ document.boards[i].textDocuments[j].content = delta;  db.hadronUsers.save(document); return {saved: true}; }}}} return {saved: false};}',[ownerEmail, boardName, textDocumentName, delta])
      .then(function(response) {
          if(response.saved) {
            res.status(200).json({});
          } else {
            res.status(401).json({});
          }
      })
      .catch(function(err) {
        return res.status(500).json({message: err.message});
      });
  	});

  	application.post(genericConstants.GET_BOARD_BY_NAME_URL, function(req, res) {
  		var data = req.body;
      var email = req.email;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;

  		db.eval('function(email, ownerEmail, boardName){var document = db.hadronUsers.findOne({email: ownerEmail}); var me = db.hadronUsers.findOne({email: email}); if(!document) {return null;} for(var i=0;i<document.boards.length;i++){ if(document.boards[i].name === boardName) { me.lastVisited.name = boardName; me.lastVisited.email = ownerEmail; db.hadronUsers.save(me); var board = document.boards[i]; board.ownerEmail = ownerEmail; document.board = board; delete document.boards; for(var j=0;j<board.textDocuments.length;j++){if(board.textDocuments[j].name = board.lastVisited.name){board.textDocument=board.textDocuments[j]; delete board.textDocuments; delete board.lastVisited; return board;}}}} return null;}',[email, ownerEmail, boardName])
  		.then(function(response) {
  			if(response == null) {
  				return res.status(401).json({});
  			} else {
  				res.status(200).json(response);
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({});
  		});
  	});

	application.post(genericConstants.GET_TEXT_DOCUMENT_BY_NAME_URL, function(req, res) {
  		var data = req.body;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var textDocumentName = data.textDocumentName;

  		db.eval('function(ownerEmail, boardName, textDocumentName){var document = db.hadronUsers.findOne({email: ownerEmail, \'boards.name\': boardName}); for(var i=0;i<document.boards.length;i++){ if(document.boards[i].name === boardName) { var board = document.boards[i]; for(var j=0;j<board.textDocuments.length;j++){ if(board.textDocuments[j].name === textDocumentName) { document.boards[i].lastVisited = {email: ownerEmail, name: textDocumentName}; db.hadronUsers.save(document);  return board.textDocuments[j];}}}} return null;}',[ownerEmail, boardName, textDocumentName])
  		.then(function(response) {
  			if(response == null) {
  				return res.status(401).json({});
  			} else {
  				res.status(200).json(response);
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({});
  		});
  	});

  	application.post(genericConstants.SHARE_BOARD_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		var shareEmail = data.shareEmail;
  		var boardName = data.boardName;
  		var roomId = uuidV4();

  		db.eval('function(email, shareEmail, boardName, roomId){ var document = db.hadronUsers.findOne({email:shareEmail}, {email:1});  if(document && document.email) { var toUpdate = db.hadronUsers.findOne({email:email}); for(var i=0;i<toUpdate.boards.length;i++){ if(toUpdate.boards[i].name === boardName){toUpdate.boards[i].shared.userIds.push(shareEmail); for(var j=0;j<toUpdate.boards[i].textDocuments.length;j++){if(!toUpdate.boards[i].textDocuments[j].roomId){toUpdate.boards[i].textDocuments[j].roomId = roomId + \'-\' + toUpdate.boards[i].textDocuments[j].name;}} db.hadronUsers.save(toUpdate); return {saved:true}; }}}else{return {saved: false};} }', [email, shareEmail, boardName, roomId])
  		.then(function(response) {
  			if(response.saved) {
  				res.status(200).json({});
  			} else {
  				res.status(401).json({});
  			}
  		})
  		.catch(function(err){
  			res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.CREATE_BOARD_URL, function(req, res) {
  	    var data =req.body;		
  		var name = data.name;
  		var email = req.email;
  		hadronUsersCollection
		.findOne({email: email}, {fields:{'boards.name':1}})
		.then(function(document) {
			if(document) {
				var length = document.boards.length;
				for(var i=0;i<length;i++) {
					var board = document.boards[0];
					if(board.name === name) {
						return res.status(401).json({});
					}
				}
			}
			var textDocumentName = 'change_title_' + uuidV4();
			var board = {
          id: uuidV4() + '_' + Date.now(),
	  			name: name,
	  			textDocuments:[{
	  				name: textDocumentName
	  			}],
          files: [],
	  			lastVisited: {
	  				name: textDocumentName,
	  				email: email
	  			},
	  			shared: {
	  				userIds:[]
	  			}
	  		};

	  		hadronUsersCollection.findAndModify({ 
			   	email: email
			   }, [['email', 1]], 
			   { 
			   	$push: { 'boards': board },
			   	$set: { 'lastVisited.name': name, 'lastVisited.email': email }
			   }, {
			   	new: true,
			   	fields: {
			   	 'boards.name': 1,
			   	 'boards.textDocuments': 1
			   }})
	  		.then(function(document) {
	  			board.textDocument = board.textDocuments[0];
	  			board.ownerEmail = email;
	  			delete board.textDocuments;
	  			delete board.shared;
	  			delete board.lastVisited;
				return res.status(200).json(board);
	  		})
	  		.catch(function(err) {
	  			return res.status(500).json({message: err.message})
	  		});
	    });
  	});
 
  	application.get(genericConstants.GET_LAST_MODIFIED_BOARD_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		db.eval('function(email){  var document = db.hadronUsers.findOne({email: email}, {lastVisited: 1}); if(!document.lastVisited) {return null;} var lastVisited = db.hadronUsers.findOne({ $or: [{email: email, \'boards.name\': document.lastVisited.name}, {\'boards.shared.userIds\':{ $in : [email]}, \'boards.name\': document.lastVisited.name}] }); for(var k=0;k<lastVisited.boards.length;k++) { if(lastVisited.boards[k].name === document.lastVisited.name) { var board = lastVisited.boards[k]; for(var i=0; i< board.textDocuments.length;i++) { if(board.lastVisited.name == board.textDocuments[i].name) {board.textDocument = board.textDocuments[i]; board.ownerEmail = board.lastVisited.email; delete board.textDocuments; delete board.lastVisited; return board;}}}} return null;}', [email])
		.then(function(response) {
			if(!response) {
				res.status(401).json({});
			}
			res.json(response);
		})
		.catch(function(err){
			res.status(500).json({message: err.message});
		});
  	});

  	application.get(genericConstants.GET_BOARDS_LIST_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		hadronUsersCollection
  		.find({ $or: [{email: email}, { 'boards.shared.userIds': { $in: [email]}}]}, {fields: {'email': 1, 'boards.name': 1}})
  		.toArray()
  		.then(function(documents) {
  			var toReturn = [];
  			for(var i=0;i<documents.length; i++) {
  				for(var j=0;j<documents[i].boards.length;j++) {
  					var board = documents[i].boards[j];
	  				toReturn.push({
	  					ownerEmail: documents[i].email,
	  					name: board.name,
	  					isShared: email !== documents[i].email || (email === documents[i].email && documents[i].boards[j].shared && documents[i].boards[j].shared.userIds.length !== 0)
	  				});
  				}
  			}
  			res.status(200).json(toReturn);
  		})
  		.catch(function(err) {
  			res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.GET_TEXT_DOCUMENT_LIST_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		var boardName = data.boardName;

  		hadronUsersCollection
  		.find({ $or: [{email: email, 'boards.name': boardName}, { 'boards.shared.userIds': { $in: [email]}, 'boards.name': boardName}]}, {fields: {'email': 1, 'boards.textDocuments.name': 1, 'boards.name': 1}})
  		.toArray()
  		.then(function(documents) {
  			if(documents.length === 0) {
  				return res.status(401).json({});
  			}
  			var toReturn = [];
  			for(var i=0;i<documents.length;i++) {
          for(var j=0;j<documents[i].boards.length;j++) {
    				var board = documents[i].boards[j];
            if(board.name === boardName) {
      				for(var k=0;k<board.textDocuments.length;k++) {
      					var textDocument = board.textDocuments[k];
    	  				toReturn.push({
                  ownerEmail: documents[i].email,
    	  					name: textDocument.name
    	  				});
      				}
            }
          }
  			}
  			res.status(200).json(toReturn);
  		})
  		.catch(function(err) {
  			res.status(500).json({message: err.message});
  		});
  	});

    /*application.post(genericConstants.SAVE_CLUSTER_URL, function(req, res) {
      var email = req.email;
      var data = req.body;
      var clusterLabel = data.clusterLabel;
      var clusterColor = data.clusterColor;
      var clusterDescription = data.clusterDescription;
      var clusterId = uuidV4();

      hadronUsersCollection
      .update({email: email}, {$push: {'roadMap.clusters': {
        clusterId: uuidV4(),
        clusterColor: clusterColor,
        clusterDescription: clusterDescription,
        clusterLabel: clusterLabel
      }}})
      .then(function() {
        res.status(200).json({});
      })
      .catch(function(err) {
        res.status(500).json({message: err.message});
      });

    });

     application.post(genericConstants.SAVE_NODE_URL, function(req, res) {
      var email = req.email;
      var data = req.body;
      var nodeLabel = data.nodeLabel;
      var nodeId = uuidV4();
      var nodeDescription = data.clusterDescription;
      var clusterId = data.clusterId;

       hadronUsersCollection
      .update({email: email}, {$push: {'roadMap.nodes': {
        nodeId: uuidV4(),
        clusterId: clusterId,
        nodeDescription: nodeDescription,
        nodeLabel: nodeLabel
      }}})
      .then(function() {
        res.status(200).json({});
      })
      .catch(function(err) {
        res.status(500).json({message: err.message});
      });
     });

     application.get(genericConstants.GET_ROAD_MAP, function(req, res) {
      var email = req.email;
      hadronUsersCollection
      .findOne({email: email}, {fields: {roadMap:1}})
      .then(function(document) {
        res.status(200).json(document.roadMap);
      })
      .catch(function(err) {
        res.status(500).json({message: err.message});
      });
     });*/
}