var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next)
{
	console.log('Express: Entering route INDEX');

	res.render('index',
	{
		title: 'SocialHub Test AB',
	});
});

module.exports = router;
