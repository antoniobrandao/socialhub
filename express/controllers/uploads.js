
module.exports = {

	upload_file: function(req, res, next)
	{
		console.log(':::::::::::::::::::::::::::::::');
		console.log('::: Express ::: upload_file :::');
		console.log(':::::::::::::::::::::::::::::::');

		res.json({
			url: 'resources/upload/images/' + req.file.filename,
			full_url: req.file.path,
		});
	},
}