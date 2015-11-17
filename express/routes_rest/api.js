
var account = require('../controllers/account');
var addon 	= require('../controllers/addon');
var user 	= require('../controllers/user');
var uploads = require('../controllers/uploads');

module.exports = function(app) 
{
	// addons ==============================================

	app.get('/api/addons', 					addon.list);

	app.post('/api/addon', 					addon.create);
	app.get('/api/addon/:addonId', 			addon.oneById);
	app.put('/api/addon/:addonId',			addon.update);
	app.delete('/api/addon/:addonId',		addon.remove);

	// accounts ============================================

	app.get('/api/accounts', 				account.list);

	app.post('/api/account', 				account.create);
	app.get('/api/account/:accountId', 		account.oneById);
	app.put('/api/account/:accountId',		account.update);
	app.delete('/api/account/:accountId',	account.remove);

	// users ==============================================

	app.get('/api/users', 					user.list);

	app.post('/api/user', 					user.create);
	app.get('/api/user/:userId', 			user.oneById);
	app.put('/api/user/:userId',			user.update);
	app.delete('/api/user/:userId',			user.remove);

	// uploads ==============================================

	app.post('/upload', _uploads.single('file'), uploads.upload_file);
}
