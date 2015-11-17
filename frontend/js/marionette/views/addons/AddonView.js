var template_instance = require("./templates/addon_view.jade");	

App.Views.AddonView = Marionette.ItemView.extend(
{
	template: template_instance,

	behaviors: {
		ToggleEnableAddon: {},
		SaveOnEnterKey: {},
		UploadImage: {},
	},

	initialize: function()
	{
		console.info('AddonView ::: initialize ::: _id: ' + this.model.get('_id'));
	},

	className: function()
	{
		return 'addon-element addon-element-' + this.model.get('_id');
	},

	templateHelpers: function()
	{
		return {
			name: 				this.model.get('name'),
			imageURL: 			this.model.get('imageURL'),
			needs_permission: 	this.model.get('needs_permission'),
			addon_state: 		window.frontend_app.getAddonState(this.model.get('_id')),
		}
	},

	onShow: function()
	{
		console.log('AddonView ::: onShow');
	},

	ui: {
		'nameInput': 		'.input-name',
		'descriptionInput': '.input-description',
	},

	events: {
		'click .input-remove': 	'kill',
	},

	save: function()
	{
		console.log('AddonView ::: save');

		this.model.set('name', this.ui.nameInput.val());
		this.model.set('description', this.ui.descriptionInput.val());

		window.frontend_app.saveModel(this.model);
	},

	kill: function()
	{
		window.frontend_app.destroyModel(this.model);
	},
});