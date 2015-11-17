var template_instance = require("./templates/no_addons_view.jade");

App.Views.NoAddonsView = Marionette.ItemView.extend(
{
	template: template_instance,
});