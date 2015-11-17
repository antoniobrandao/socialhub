var template_instance = require("./templates/page_text_view.jade");

App.Views.PageTextView = Marionette.ItemView.extend(
{
	template: template_instance,

	onShow: function()
	{
		console.log('PageTextView ::: onShow');
	}
});