
module.exports = function(app)
{
	app.param('accountId', function(req, res, next, accountId)
	{
		console.log('Express: param accountId searching for id: ' + accountId);
		
		Account.findById(accountId, function (err, item)
		{
			if(err) 
			{ res.json(err) }
			else
			{
				if (item) {
				req.account = item;
				next(); }
			}
		});
	});


	app.param('addonId', function(req, res, next, addonId)
	{
		console.log('Express: param addonId searching for id: ' + addonId);
		
		Addon.findById(addonId, function (err, item)
		{
			if(err) 
			{ res.json(err) }
			else
			{
				if (item) {
				req.addon = item;
				next(); }
			}
		});
	});


	app.param('userId', function(req, res, next, userId)
	{
		console.log('Express: param userId searching for id: ' + userId);
		
		User.findById(userId, function (err, item)
		{
			if(err) 
			{ res.json(err) }
			else
			{
				if (item) {
				req._user = item;
				next(); }
			}
		});
	});
}