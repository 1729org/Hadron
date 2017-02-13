var express    			=  require('express'),
	bodyParser 			=  require('body-parser'),
	application         =  express(),
	cors                =  require('./cors-filter')(application),
	genericConstants    =  require('./generic-constants')(),
	http				=  require('http'),
	mongodb = require('mongodb'),
    mongoClient = mongodb.MongoClient;

require('./interceptor.js')(application, genericConstants);

mongoClient.connect('mongodb://localhost:27017/hadrondb', function (err, db) {
	if(err) {
		console.log('Error connecting to database localhost:27017/hadrondb ', err)
	} else {
 		require('./authentication-server')(db, application, genericConstants);
 	}
});

http.createServer(application).listen(8080, function(){
  console.log("Express server listening on port " + 8080);
});

