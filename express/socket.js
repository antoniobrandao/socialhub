var email = require('./controllers/email');
var create_addon = require('./controllers/create_addon');

// for the sake of this test, a global variable will be used (instead of Session socket)
SOCKET = null;

module.exports = {

	setup: function(server)
	{
		var io = require('socket.io')(server);
			
		io.on('connection', function(socket_instance)
		{
			SOCKET = socket_instance;
			SOCKET.on('create_addon', create_addon.create);
			SOCKET.on('send_email', function(data)
			{
				email.send_email(data);
			});
		});
	},
}