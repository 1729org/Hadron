module.exports = function(db, application, genericConstants, tokenHandler) {
	var hadronUsersCollection = db.collection('hadronUsers');
	var ObjectId = require('mongodb').ObjectID;
	var uuidV4 = require('uuid/v4');

	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	application.get(genericConstants.LOGIN_URL, function(req, res) {
		console.log(req.headers['authorization']);
		var buffer = new Buffer(req.headers['authorization'], 'Base64');
		var email = buffer
					.toString();
		var randomColor = getRandomColor();
		hadronUsersCollection
		.findOne({email: email}, {fields: {email: 1}})
		.then(function(document) {
			console.log(randomColor);
			if(!document) {
				hadronUsersCollection.insert({
					email: email,
					settings: {
						assignedUserColor: randomColor
					},
					boards: []
				});
				res.writeHead(401, {'x-auth-token' : tokenHandler.generateToken({email: email, assignedUserColor: randomColor}) } );
				res.end();
			} else {
				db.eval('function(email){  var document = db.hadronUsers.findOne({email: email}, {lastVisited: 1}); if(!document.lastVisited) {return null;} var aggregation = db.hadronUsers.aggregate([{$match: { $or: [{email: email, \'boards.name\': document.lastVisited.name}, {\'boards.shared.userIds\':{ $in : [email]}, \'boards.name\': document.lastVisited.name}] }}, { $project: { board: { $arrayElemAt: [\'$boards\',0]}}}]); var board = aggregation._batch[0].board; for(var i=0; i< board.textDocuments.length;i++) { if(board.lastVisited.name == board.textDocuments[i].name) {board.textDocument = board.textDocuments[i]; board.ownerEmail = board.lastVisited.email; delete board.textDocuments; delete board.lastVisited; return board;}} return null;}', [email])
				.then(function(response) {
					if(!response) {
						res.writeHead(401, {'x-auth-token' : tokenHandler.generateToken({email: email, assignedUserColor: randomColor}) } );
						return res.end();
					}
					res.setHeader('x-auth-token', tokenHandler.generateToken({email: email, assignedUserColor: randomColor}));
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
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
  		var data = req.body();
  		var email = req.email;
  		var boardName = data.boardName;
  		var newBoardName = data.newBoardName;

  		hadronCollection
  		.findOne({email: email, 'boards.name': newBoardName})
  		.then(function(document) {
  			if(document) {
  				res.status(401).json({});
  			} else {
  				hadronUsersCollection
		  		.update({email: email, 'boards.name': boardName}, {$set:{'boards.name': newBoardName}})
		  		.then(function() {
		  			return res.status(200).json({});
		  		})
		  		.catch(function(err) {
		  			return res.status(500).json({message: err.message});
		  		});	
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.CHANGE_TEXT_DOCUMENT_NAME_URL, function(req, res) {
  		var data = req.body();
  		var ownerEmail = data.ownerEmail;
  		var documentName = data.documentName;
  		var newDocumentName = data.newDocumentName;
  		
  		hadronCollection
  		.findOne({email: ownerEmail, 'boards.textDocuments.name': newDocumentName})
  		.then(function(document) {
  			if(document) {
  				res.status(401).json({});
  			} else {
  				hadronUsersCollection
		  		.update({email: email, 'boards.textDocuments.name': documentName}, {$set:{'boards.textDocuments.name': newDocumentName}})
		  		.then(function() {
		  			return res.status(200).json({});
		  		})
		  		.catch(function(err) {
		  			return res.status(500).json({message: err.message});
		  		});	
  			}
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

  	application.post(genericConstants.SAVE_TEXT_DOCUMENT_URL , function(req, res) {
  		var data = req.body();
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var documentName = data.documentName;
  		var deltaArr = data.delta;

  		hadronCollection
  		.update({email: ownerEmail, 'boards.name': boardName, 'boards.textDocuments.name': documentName}, 
  			{ $push: { 'boards.textDocuments.content': { $each: deltaArr} } })
  		.then(function() {
  			return res.status(200).json({});
  		})
  		.catch(function(err) {
  			return res.status(500).json({message: err.message});
  		});
  	});

  	application.get(genericConstants.GET_BOARD_BY_NAME_URL, function(req, res) {
  		var data = req.body();
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;

  		hadronUsersCollection
  		.findOne({email: ownerEmail, 'boards.name': boardName}, {fields: {'boards': 1, 'boards.textDocuments': 1, 'boards.name': 1}})
  		.then(function(document) {
  			var board = document.boards[0];
  			board.textDocument = board.textDocuments[0];
  			delete board.textDocuments;
  			return res.status(200).json(board);
  		})
  		.catch(function(err) {
  			return res.status(500).json({});
  		});
  	});

	application.get(genericConstants.GET_TEXT_DOCUMENT_BY_NAME_URL, function(req, res) {
  		var data = req.body();
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;
  		var documentName = data.documentName;

  		hadronUsersCollection
  		.findOne({email: ownerEmail, 'boards.name': boardName}, {fields: {'boards': 1, 'boards.textDocuments': 1, 'boards.name': 1}})
  		.then(function(document) {
  			var board = document.boards[0];
  			board.textDocument = board.textDocuments[0];
  			delete board.textDocuments;
  			return res.status(200).json(board);
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

  		db.eval('function(email, shareEmail, boardName, roomId){ var document = db.hadronUsers.findOne({email:shareEmail}, {email:1});  if(document && document.email) { var toUpdate = db.hadronUsers.findOne({email:email}); for(var i=0;i<toUpdate.boards.length;i++){ if(toUpdate.boards[i].name === boardName){toUpdate.boards[i].shared.userIds.push(shareEmail); if(!toUpdate.boards[i].shared.roomId){ toUpdate.boards[i].shared.roomId = roomId;}}} db.hadronUsers.save(toUpdate); return {saved: true}; }else{return {saved: false};} }', [email, shareEmail, boardName, roomId])
  		.then(function(response) {
  			console.log(response);
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
			var textDocumentName = 'change_title_' + (length + 1);
			var board = {
	  			name: name,
	  			textDocuments:[{
	  				name: textDocumentName
	  			}],
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
				return res.status(200).json(board);
	  		})
	  		.catch(function(err) {
	  			return res.status(500).json({message: err.message})
	  		});
	    });
  	});

  	application.post(genericConstants.GET_LAST_MODIFIED_BOARD_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		db.eval('function(email){  var document = db.hadronUsers.findOne({email: email}, {lastVisited: 1}); if(!document.lastVisited) {return null;} var aggregation = db.hadronUsers.aggregate([{$match: { $or: [{email: email, \'boards.name\': document.lastVisited.name}, {\'boards.shared.userIds\':{ $in : [email]}, \'boards.name\': document.lastVisited.name}] }}, { $project: { board: { $arrayElemAt: [\'$boards\',0]}}}]); var board = aggregation._batch[0].board; for(var i=0; i< board.textDocuments.length;i++) { if(board.lastVisited.name == board.textDocuments[i].name) {board.textDocument = board.textDocuments[i]; board.ownerEmail = board.lastVisited.email; delete board.textDocuments; delete board.lastVisited; return board;}} return null;}', [email])
		.then(function(response) {
			if(!response) {
				res.status(401).json({});
			}
			res.setHeader('Content-Type', 'application/json');
			res.json(response);
		})
		.catch(function(err){
			res.status(500).json({message: err.message});
		});
  	});

  	application.get(genericConstants.GET_BOARDS_LIST_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		console.log(email);
  		hadronUsersCollection
  		.find({ $or: [{email: email}, { 'boards.shared.userIds': { $in: [email]}}]}, {fields: {'email': 1, 'boards.name': 1}})
  		.toArray()
  		.then(function(documents) {
  			var toReturn = [];
  			for(var i=0;i<documents.length; i++) {
  				var board = documents[i].boards[0];
  				toReturn.push({
  					ownerEmail: documents[i].email,
  					name: board.name,
  					isShared: email !== documents[i].email
  				});
  			}
  			res.status(200).json(toReturn);
  		})
  		.catch(function(err) {
  			res.status(500).json({message: err.message});
  		});
  	});

  	application.get(genericConstants.GET_TEXT_DOCUMENT_LIST_URL, function(req, res) {
  		var data = req.body;
  		var email = req.email;
  		var ownerEmail = data.ownerEmail;
  		var boardName = data.boardName;

  		hadronUsersCollection
  		.find({ $or: [{email: email}, { 'boards.shared.userIds': { $in: [email]}}]}, {fields: {'email': 1, 'boards.name': 1}})
  		.toArray(function(documemnt) {
  			var toReturn = [];
  			for(var document in documents) {
  				toReturn.push({
  					email: document.email,
  					name: document.boards[0].name,
  					isShared: email !== document.email
  				});
  			}
  			res.status(200).json(toReturn);
  		})
  		.catch(function(err) {
  			res.status(500).json({message: err.message});
  		});
  	});
}