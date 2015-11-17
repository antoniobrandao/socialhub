
/*
 * List all
 */

exports.list = function(req, res)
{
	Account.find({}, function(err, docs)
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
	res.json(req.account);
};

/*
 * POST new
 */

exports.create = function(req, res)
{
	var new_item 	= new Account();

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
	var current_item 			= req.account;

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
	req.account.remove(function(err) 
	{
		if(err) 
			res.json(err)
		else
			res.json('all good');
	});
};
