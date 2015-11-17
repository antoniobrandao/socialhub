Marionette.Behaviors.behaviorsLookup = function() {
  return App.Behaviours;
}

App.Behaviours.SaveOnEnterKey = Marionette.Behavior.extend({
	
	events: {
		'keyup input': 'catchEnter',
	},

	catchEnter: function(e)
	{
		if(e.keyCode === 13) // enter key
		{
			console.log('enter key');
			this.view.save();
		}
	},
});


App.Behaviours.ToggleEnableAddon = Marionette.Behavior.extend({
	
	events: {
		'click .enabled-toggle': 'toggleEnableAddon'
	},

	toggleEnableAddon: function(e)
	{
		console.log('toggleEnableAddon');

		// get clicked Addon's ID
		// get USER's "enabledAddons" Array
		// verify if addon's ID exists in USER's "enabledAddons" Array
		// if yes - remove it, update USER's model array, set Switch as OFF
		// if no & needs_permission FALSE - add it, update USER's model array, set Switch as ON
		// if no & needs_permission TRUE - set Switch as PENDING and send email

		var addon_id 			= this.view.model.get('_id');
		var needs_permission 	= this.view.model.get('needs_permission');
		var current_user_addons = window.frontend_app.current_user_model.get('enabledAddons');
		var current_pending_addons = window.frontend_app.current_user_model.get('pendingAddons');

		var index_of_addon_known = current_user_addons.indexOf(addon_id);
		var index_of_addon_pending = current_pending_addons.indexOf(addon_id);

		var enabled_addon = false;
		var pending = false;

		if (index_of_addon_known !== -1) // user has this addon enabled, remove it
		{
			current_user_addons.splice(index_of_addon_known, 1);

			window.frontend_app.current_user_model.set('enabledAddons', current_user_addons);

			$(e.currentTarget).removeClass('active');
		}
		else
		{
			if (needs_permission)
			{
				if (index_of_addon_pending !== -1) // addon is still in pendingAddons, remove it
				{
					current_pending_addons.splice(index_of_addon_pending, 1);

					window.frontend_app.current_user_model.set('pendingAddons', current_pending_addons);

					$(e.currentTarget).removeClass('pending');
				}
				else // send addon to pendingAddons
				{
					enabled_addon = true;
					pending = true;

					current_pending_addons.push(addon_id);

					window.frontend_app.current_user_model.set('pendingAddons', current_pending_addons);

					$(e.currentTarget).addClass('pending');

					modal.createModal(
					{
					    closeOnOKClick          : false,
					    type                    : 'simple',
					    titleText               : 'Approval Pending',
					    textText                : 'This Addon requires approval. Please wait while Socialhub staff validates your request.',
					    confirmButtonText       : 'OK',
					    showCancelButton        : false,
					    defaultOKIsClose        : true,
					    titleMarginBottom       : '20px',
					    buttonsMarginTop        : '20px',
					});

					window.frontend_app.sendNotificationEmail(addon_id);
				}
			}
			else // user doesn't have this addon and it does not require permission - just enable it
			{
				enabled_addon = true;

				current_user_addons.push(addon_id);

				window.frontend_app.current_user_model.set('enabledAddons', current_user_addons);

				$(e.currentTarget).addClass('active');
			}
		}

		var successCallback = function()
		{
			if (enabled_addon === true) {
				if (pending) {
					$.ambiance({ message: 'Pending Approval', type: 'warning' });	
				} else {
					$.ambiance({ message: 'Addon Enabled', type: 'success' });	
				}
			} else {
				$.ambiance({ message: 'Addon Disabled', type: 'default' });	
			}
		}

		var errorCallback = function()
		{
			$.ambiance({ message: 'Error Enabling Addon', type: 'error' });
		}

		window.frontend_app.saveModel(window.frontend_app.current_user_model, successCallback, errorCallback, true);
	},
});






App.Behaviours.UploadImage = Marionette.Behavior.extend({
	defaults: {
	},

	events: {
		'click .cover-image.empty': 	'invokeSelectCoverImageDialog',
		'click .change-cover-image': 	'invokeSelectCoverImageDialog',
		'change .cover-image-uploader': 'processCoverImageSelect',
	},

	invokeSelectCoverImageDialog: function(e)
	{
		var a = this.view.$el[0];
		var b = a.querySelector('.cover-image-uploader');
		b.click();
	},

	processCoverImageSelect: function(e)
	{
		var self = this;

		$(e.currentTarget.parentNode).ajaxSubmit(
        {
	        error: function(xhr) 
	        {
				$.ambiance({ message: 'Image Upload Error', type: 'error' });
	        },

	        success: function(new_image_data) 
	        {
		        console.log('UploadImage ::: upload complete ::: new_image_data = ' + new_image_data);
	
		        self.view.model.set('imageURL', new_image_data.url);
		        self.view.model.set('imageRootURL', new_image_data.full_url);

		        self.view.model.save();
				self.view.render();

				$.ambiance({ message: 'Image upload success', type: 'success' });
	        }
		});
	},
});


