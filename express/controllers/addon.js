var fs = require('fs');

/*
 * List all, sort by date
 */

exports.list = function(req, res)
{
	Addon.find({}).sort({date: -1}).exec(function(err, docs)
	{
		if(err) 
			res.json(err)

		if (docs)
			res.json(docs);
	});
};

/*
 * GET single by id
 */

exports.oneById = function(req, res)
{
	res.json(req.addon);
};

/*
 * POST new
 */

exports.create = function(req, res)
{
	var new_item 	= new Addon();
	var b 			= req.body;

	new_item.save( function(err, item)
	{
		if(err)
			res.json(err)

		if (item) 
		{
			res.json(item);
		}
	});
};


/*
 * PUT single
 */

exports.update = function(req, res)
{
	var b 				= req.body;
	var current_item 	= req.addon;

	// remove previous image file
	if (b.imageURL !== current_item.imageURL) {
		if (fs.existsSync(req.addon.imageRootURL)) {
			console.log('update existsSync');
			fs.unlinkSync(current_item.imageRootURL);
		}
	}

	current_item.name 			= b.name;
	current_item.description	= b.description;
	current_item.imageURL		= b.imageURL;
	current_item.imageRootURL	= b.imageRootURL;

	current_item.save(function (err, item, numberAffected) 
	{
		if(err)
			res.json(err)

		if (item) 
			res.json(item);
	});
};


/*
 * DELETE single
 */

exports.remove = function(req, res)
{
	console.log('deleting req.addon.imageURL: ' + req.addon.imageURL );

	// remove image file
	if (req.addon.imageRootURL) {
		if (fs.existsSync(req.addon.imageRootURL)) {
			console.log('update existsSync');
			fs.unlinkSync(req.addon.imageRootURL);
		}
	}

	req.addon.remove(function(err) 
	{
		if(err) 
			res.json(err)
		else
			res.json('all good');
	});
};
