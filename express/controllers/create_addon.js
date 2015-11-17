
var createRandomString = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {

	create: function()
	{
		console.log('::::::::::::::::::::::::::::::::');
		console.log('::: Express ::: create_addon :::');
		console.log('::::::::::::::::::::::::::::::::');

		var new_addon 	= new Addon();

		new_addon.name = createRandomString().toUpperCase();
		new_addon.needs_permission = Math.random() < 0.5 ? true : false;

		new_addon.save( function(err, item)
		{
			if(err)
				console.log('createNewAddon Error');

			if (item) 
				SOCKET.emit("server_created_addon", item);
		});
	},
}