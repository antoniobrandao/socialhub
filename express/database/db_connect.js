var mongoose = require('mongoose');

module.exports = function(connectedCallback) {

	// connect to db

	DB_PATH = "mongodb://localhost/socialhub_test";

	var options = { db 		: { native_parser 	: true },
					server  : { poolSize 		: 5,
								socketOptions 	: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                	replset : { socketOptions 	: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 

	mongoose.connection.on('error', function(error)
	{
		console.error('db_connect ::: mongoose connection ERROR');
	  	throw new Error(error);
	});

	mongoose.connection.on('open', function(error)
	{
		console.error('db_connect ::: mongoose connection OPEN');

		connectedCallback();
	});

	mongoose.connect(DB_PATH, options);
}