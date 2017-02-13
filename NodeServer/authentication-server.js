module.exports = function(db, application, genericConstants) {
	var hadronUsersCollection = db.collection('hadronUsers');
	var ObjectId = require('mongodb').ObjectID;

	application.get(genericConstants.LOGIN_URL, function(req, res) {
		var buffer = new Buffer(req.headers['authorization'], 'Base64');
		var email = buffer
					.toString();
		hadronUsersCollection
		.findOne({email: email})
		.then(function(document) {
			if(!document) {
				res.status(401).json({});
			}
		});

  	});
}