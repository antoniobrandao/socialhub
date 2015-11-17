window.Backbone        = require('backbone');	
window._        	   = require('underscore');	
window.Backbone.$      = $;
window.Marionette      = require('backbone.marionette');

window.App = 
{
	Views: {},
	Models: {},
	Behaviours: {},
	collections: {},
	collectionDefinitions: {},
};

var views     	= require("./views");
var router    	= require("./router");
var models      = require("./models");
var behaviours  = require("./behaviours");

window.collections = require("./collections");
window.functions   = require("./functions");

module.exports = {

	init: function()
	{
		console.log('application: init');

		App.Marionette = new Marionette.Application();

		App.Marionette.addRegions({
			mainAreaRegion: "#main-area"
		});

		App.Marionette.addInitializer(function(options)
		{
			router.startup();
			App.Marionette.router = router.getRouter();
			Backbone.history.start({pushState: false, root: ''});
		});
	},

	startup: function()
	{
		console.log('application: startup');

		App.Marionette.start( { } );
	}
}
