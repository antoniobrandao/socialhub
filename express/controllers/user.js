
/*
 * List all
 */

exports.list = function(req, res)
{
	User.find({}, function(err, docs)
	{
		if(err) 
			res.json(err)

		if (docs)
			res.json(docs);
	})
};

/*
 * GET single by id
 */

exports.oneById = function(req, res)
{
	res.json(req._user);
};

/*
 * POST new
 */

exports.create = function(req, res)
{
	var new_item 	= new User();
	var b 			= req.body;

	new_item.save( function(err, item)
	{
		if(err) 
			res.json(err)

		if (item) 
			res.json(item);
	});
};


/*
 * PUT single
 */

exports.update = function(req, res)
{
	var b 						= req.body;
	var current_item 			= req._user;

	current_item.knownAddons 	= b.knownAddons;
	current_item.enabledAddons 	= b.enabledAddons;
	current_item.pendingAddons 	= b.pendingAddons;

	current_item.save(function (err, item, numberAffected) 
	{
		if(err) 
		{
			res.json(err)
		}
		else
		{
			if (item) 
			{
				res.json(item);
			};
		}
	});
};


/*
 * DELETE single
 */

exports.remove = function(req, res)
{
	req._user.remove(function(err) 
	{
		if(err) 
			res.json(err)
		else
			res.json('all good');
	});
};
