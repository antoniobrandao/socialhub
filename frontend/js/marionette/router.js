var MyRouter;

module.exports = {

	startup: function( )
	{
		console.log('Marionette router ::: startup');
		
		MyRouter = new Marionette.AppRouter(
		{
			controller: routesController,

			appRoutes: {
				'': 			'index',
				'page_empty': 	'gotoPageText',
			}
		});
	},

	getRouter: function()
	{
		return MyRouter;
	},
}

var routesController = 
{
	index: function()
	{
		console.log('Marionette router ::: index');

		// highlight current menu button
		window.frontend_app.highlightCurrentMenuButton( Backbone.history.fragment );

		// badge is never shown on home (Addons Page) because they can be seen in the list
		window.frontend_app.disableBadge();

		// handler called after required collections are loaded
		var process = function() {
			// create the Addons list backbone view
			App.Marionette.mainAreaRegion.show( new App.Views.AddonsListView({ collection: App.collections.addons, sort: false }) );
		}

		// check data and then execute process function
		this.dataCheck(process);
	},

	gotoPageText: function()
	{
		console.log('Marionette router ::: gotoPageText :::');

		// highlight current menu button
		window.frontend_app.highlightCurrentMenuButton( Backbone.history.fragment );

		// handler called after required collections are loaded
		var process = function() {
			// update numerical badge
			window.frontend_app.updateBadge();
			// create empty page view
			App.Marionette.mainAreaRegion.show( new App.Views.PageTextView({}));
		}

		// check data and then execute process function
		this.dataCheck(process);
	},

	dataCheck: function(callback)
	{
		console.log('Marionette router ::: dataCheck :::');

		// this function serves at startup of every client route to make sure we have the required data and variables
		var finalCallback = function()
		{
			// set up required global variables
			// we just have one user and one account, get by index
			window.frontend_app.current_user_model 		= App.collections.users.models[0];
			window.frontend_app.current_user_id    		= App.collections.users.models[0].get('_id');
			window.frontend_app.current_account_model 	= App.collections.accounts.models[0];
			window.frontend_app.unseen_new_addons 		= window.frontend_app.getUserUnseenAddons();

			callback();
		}

		if (!App.collections.addons)
		{
			console.log('Marionette router ::: index::: must load collections');

			window.frontend_app.loadCollections([
				'Accounts',
				'Addons',
				'Users',
			], finalCallback);

		} else {
			console.log('Marionette router ::: index ::: collections already loaded');
			finalCallback();
		}
	},
};


