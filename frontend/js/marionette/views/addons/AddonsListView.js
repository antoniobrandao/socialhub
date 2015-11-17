var template_instance = require("./templates/list_view.jade");

App.Views.AddonsListView = Marionette.CompositeView.extend(
{
	template: 			template_instance,
	childView: 			App.Views.AddonView,
	emptyView: 			App.Views.NoAddonsView,
	childViewContainer: '.addons-list',

    attachHtml: function(collectionView, childView, index)
    {
		// override to put new addons on top of list
		if (collectionView.isBuffering) {
			// initial render
			var list_parent = collectionView.el.querySelector('.addons-list');
			list_parent.insertBefore(childView.el, list_parent.children[0]);
		} else {
			// We've already rendered the main collection, prepend
			var list_parent = collectionView.el.querySelector('.addons-list');
			list_parent.insertBefore(childView.el, list_parent.children[0]);
			childView.el.addClass('new');
		}
	},

	onShow: function()
	{
		console.log('AddonsListView ::: onShow');

		var knownAddons    		= window.frontend_app.current_user_model.get('knownAddons');
		var allExistingAddons   = [];
		var newFoundAddons 		= [];

		// create array containing IDs of unkown Addons, to highlight them in the UI
		for (var i = 0; i <= this.collection.models.length - 1; i++)
		{
			var addon_i_id = this.collection.models[i].get('_id');
			var current_addon_el = document.querySelector('.addon-element-' + addon_i_id);
			if (current_addon_el) {
				allExistingAddons.push(addon_i_id);
				if (knownAddons.indexOf(addon_i_id) === -1) {
					newFoundAddons.push(addon_i_id);
					current_addon_el.addClass('new');
				}
			}
		}

		console.log('newFoundAddons:');
		console.dir(newFoundAddons);

		// if new addons were found, highlight them
		if (newFoundAddons.length > 0) {
			while(newFoundAddons.length > 0) {
				var going_for = newFoundAddons.pop();
				var one_new_element = document.querySelector('.addon-element-' + going_for);
				one_new_element.addClass('new');
			}
		};

		window.frontend_app.current_user_model.set('knownAddons', allExistingAddons);
		window.frontend_app.current_user_model.save();
	},

	collectionEvents: {
		"add": "modelAdded"
	},

	modelAdded: function(e)
	{
		console.log('AddonsListView ::: modelAdded');

		var knownAddons = window.frontend_app.current_user_model.get('knownAddons');
		knownAddons.push(e.id);

		// prepare to clean up user known Addons
		var allValidAddons   = [];
		var validKnownAddons = [];

		// feed array with all the currently valid Addon IDs
		for (var i = 0; i <= App.collections.addons.models.length - 1; i++)
		{
			allValidAddons.push(App.collections.addons.models[i].get('_id'));
		}

		// determine current known Addons that are still valid
		for (var i = 0; i <= knownAddons.length - 1; i++) {
			if (allValidAddons.indexOf(knownAddons[i]) !== -1) {
				validKnownAddons.push(knownAddons[i])
			};
		}

		window.frontend_app.current_user_model.set('knownAddons', validKnownAddons);
		window.frontend_app.current_user_model.save();
	},
});