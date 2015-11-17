

////  ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
////  ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
////  ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
////  ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
////  ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
////  ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
////  ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  


module.exports = {

	// getRouterBasePath: function()
	// {
	// 	return Backbone.history.fragment;
	// },

	saveContentBlocks: function(cbs, cb_els)
	{
		// loop all content block models
		for (var i = cbs.length - 1; i >= 0; i--)
		{
			var current_cb_id = cbs[i];
			var new_cb_model  = functions.getModelFromCollectionById(App.collections_dynamic['contentblocks'], current_cb_id);

			if (new_cb_model)
			{
				var new_cb_model_type_id  		= new_cb_model.get('type');
				var new_cb_model_type_string  	= functions.getModelFromCollectionById(App.collections_dynamic['contentblocktypes'], new_cb_model_type_id);
				new_cb_model_type_string 		= new_cb_model_type_string.get('title');

				console.log('new_cb_model_type_string: ' + new_cb_model_type_string);

				// loop all content block DOM elements to find block corresponding to current model
				for (var x = cb_els.length - 1; x >= 0; x--) 
				{
					console.log('cb_els[x].attributes[0].value: ' + cb_els[x].attributes[0].value);
					if (cb_els[x].attributes[0].value === current_cb_id) 
					{
						console.log('entered');
						var result_object = {};

						var save_title = false;
						var save_text = false;
						var save_cta = false;
						var save_images = false;

						switch(new_cb_model_type_string)
						{
							case 'text_block':
								save_text = true;
								break;
							case 'text_block_with_title':
								save_title = true;
								save_text = true;
								break;
							case 'text_block_with_title_and_cta':
								save_title = true;
								save_text = true;
								save_cta = true;
								break;
							case 'images_row':
								save_images = true;
								break;
							case 'images_row_with_title':
								save_images = true;
								save_title = true;
							break;
							case 'images_row_with_title_and_cta':
								save_images = true;
								save_title = true;
								save_cta = true;
							break;
						}

						// save text
						if (save_text) {
							functions.updateI18NString(new_cb_model, 'i18n_text', cb_els[x].querySelector('.ui-textarea').innerHTML);
							// new_cb_model.set('text_color', cb_els[x].querySelector('.input-text_color').value);
							// new_cb_model.set('text_align', cb_els[x].querySelector('.input-text_align').value);
						};

						// save title
						if (save_title) {
							functions.updateI18NString(new_cb_model, 'i18n_title', cb_els[x].querySelector('.input-title').value);
							new_cb_model.set('title_color', cb_els[x].querySelector('.input-title_color').value);
							new_cb_model.set('title_align', cb_els[x].querySelector('.input-title_align').value);
						};

						// save cta
						if (save_cta) {
							functions.updateI18NString(new_cb_model, 'i18n_cta', cb_els[x].querySelector('.input-cta_text').value);
							new_cb_model.set('cta_color', cb_els[x].querySelector('.input-cta_color').value);
							new_cb_model.set('cta_url', cb_els[x].querySelector('.input-cta_url').value);
						};

						// save images
						if (save_images) {
							console.log('saving images');
							var percent_inputs = cb_els[x].querySelectorAll('.input-width_percent');
							console.log('percent_inputs:');
							console.dir(percent_inputs);

							var input_values = {};

							for (var w = percent_inputs.length - 1; w >= 0; w--) {

								var percent_input_element_val 		= percent_inputs[w].value;
								var percent_input_element_media_id  = percent_inputs[w].attributes['data-media_id'].value;

								input_values[percent_input_element_media_id] = percent_inputs[w].value;
							};

							console.log('input_values:');
							console.dir(input_values);

						    var cb_original_medias_ids 		= new_cb_model.get('medias_ids');
						    var cb_original_medias_widths 	= new_cb_model.get('medias_widths');

						    for (var y = cb_original_medias_ids.length - 1; y >= 0; y--)
						    {
						    	if (input_values[cb_original_medias_ids[y]])
						    	{
						    		cb_original_medias_widths[y] = input_values[cb_original_medias_ids[y]];
						    	};
						    };

						    new_cb_model.set('medias_widths', cb_original_medias_widths );
						};

						// save bg
						// new_cb_model.set('bg_color', cb_els[x].querySelector('.input-background-color').value);

						// save
						new_cb_model.save();
					}
				}
			};
		};
	},

	getCoverImage: function(model)
	{
		var cover_image_model = functions.getModelFromCollectionById(App.collections_dynamic['medias'], model.get('cover_media_id'));

		if (cover_image_model) {
			var img_url = cover_image_model.get('url');
			return img_url;
		}
		else { return null; }
	},

	getFinalColorValue: function(color_string)
	{
		switch(color_string)
		{
			case 'dark':
				return window.current_account_model.get('color_scheme').color_a;
				break;
			case 'light':
				return window.current_account_model.get('color_scheme').color_b;
				break;
			case 'main_color':
				return window.current_account_model.get('color_scheme').color_c;
				break;
			case 'extra_color_1':
				return window.current_account_model.get('color_scheme').color_d;
				break;
			case 'extra_color_2':
				return window.current_account_model.get('color_scheme').color_e;
				break;
			default:
				return color_string;
		}
	},

	getContentBlocks: function(view)
	{
		var self = view;

		var cb = self.model.get('content_blocks');

		var content_blocks_references 		   = [];
		var obsolete_content_blocks_references = [];

		if (cb) 
		{
			for (var i = 0; i <= cb.length - 1; i++)
			{
				var new_cb 		 = {};
				var new_cb_model = functions.getModelFromCollectionById(App.collections_dynamic['contentblocks'], cb[i]);

				if (!new_cb_model) {
					obsolete_content_blocks_references.push(cb[i])
				}
				else
				{
					new_cb.id 			= new_cb_model.get('_id');
					new_cb.title_align 	= new_cb_model.get('title_align');
					new_cb.text_align 	= new_cb_model.get('text_align');

					new_cb.name 		= functions.getI18StringFromModel(new_cb_model, 'i18n_name');
					new_cb.title 		= functions.getI18StringFromModel(new_cb_model, 'i18n_title');
					new_cb.cta 			= functions.getI18StringFromModel(new_cb_model, 'i18n_cta');
					new_cb.text 		= functions.getI18StringFromModel(new_cb_model, 'i18n_text');

					new_cb.title_color 	= new_cb_model.get('title_color');
					new_cb.text_color 	= new_cb_model.get('text_color');
					new_cb.cta_color 	= new_cb_model.get('cta_color');
					new_cb.bg_color 	= new_cb_model.get('bg_color');

					new_cb.title_color_value 	= this.getFinalColorValue(new_cb_model.get('title_color'));
					new_cb.text_color_value 	= this.getFinalColorValue(new_cb_model.get('text_color'));
					new_cb.cta_color_value 		= this.getFinalColorValue(new_cb_model.get('cta_color'));
					new_cb.bg_color_value 		= this.getFinalColorValue(new_cb_model.get('bg_color'));

					console.log('new_cb.title_color_value: ' + new_cb.title_color_value);
					console.log('new_cb.text_color_value: ' + new_cb.text_color_value);
					console.log('new_cb.cta_color_value: ' + new_cb.cta_color_value);
					console.log('new_cb.bg_color_value: ' + new_cb.bg_color_value);

					new_cb.cta_url 			= new_cb_model.get('cta_url');

					new_cb.block_type_thumb	= new_cb_model.get('block_type_thumb');

					new_cb.medias_ids 	 = new_cb_model.get('medias_ids');
					new_cb.medias_widths = new_cb_model.get('medias_widths');

					new_cb.medias 		 = [];

					for (var x = new_cb.medias_ids.length - 1; x >= 0; x--)
					{
						var new_media_model = functions.getModelFromCollectionById(App.collections_dynamic['medias'], new_cb.medias_ids[x]);
						
						if (new_media_model) {

							new_cb.medias.push(
							{
								url: 	new_media_model.get('url'),
								id: 	new_media_model.get('_id'),
								width: 	new_cb.medias_widths[x],
							});
						};
					};

					var new_cb_type_id  = new_cb_model.get('type');

					var block_type_model = functions.getModelFromCollectionById(App.collections_dynamic['contentblocktypes'], new_cb_type_id)

					new_cb.type 		= block_type_model.get('title');

					content_blocks_references.push(new_cb);
				}
			};
		};

		var removed_refs = false;

		for (var x = obsolete_content_blocks_references.length - 1; x >= 0; x--)
		{
			var all_references  = self.model.get('content_blocks');
			var index 			= all_references.indexOf(obsolete_content_blocks_references[x]);

			if (index > -1) { // remove reference from model
				removed_refs = true;
				self.model.set('content_blocks', all_references.splice(index, 1) );
			}
		};

		if (removed_refs) {
			self.model.save();
		};
		
		return content_blocks_references;
	},


	getModelFromCollectionById: function(collection, id_to_match)
	{
		// console.log('getModelFromCollectionById ::: id_to_match = ' + id_to_match);

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if ( collection.models[i].get('_id') === id_to_match ) 
				{
					// console.dir(collection.models[i]);
					
					return collection.models[i];
				};
			}

			return console.log('getModelFromCollectionById ::: no element found');
		}
		else
		{
			return console.log('getModelFromCollectionById ::: no colllection provided');
		}
	},

	getModelsFromCollectionById: function(ids_array, collection)
	{
		// console.log('getModelsFromCollectionById:');

		// console.log('ids_array: ' + ids_array);
		// console.dir(ids_array);

		if (collection)
		{
			var a = [];

			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				for (var w = ids_array.length - 1; w >= 0; w--) 
				{
					if (String(ids_array[w]) === collection.models[i].get('_id'))
					{
						a.push( collection.models[i] );
					};
				};
			};

			return a;
		}
		else
		{
			console.log('getModelsFromCollectionById: collection is undefined');
		}
	},

	getModelFromCollectionByPropertyMatch: function(collection, property_to_match, value_to_match)
	{
		// console.log('getModelFromCollectionByPropertyMatch ::: property_to_match = ' + property_to_match);

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if ( collection.models[i].get(property_to_match) === value_to_match ) 
				{
					console.dir(collection.models[i]);
					
					return collection.models[i];
				};
			}

			return console.log('getModelFromCollectionById ::: no element found');
		}
		else
		{
			return console.log('getModelFromCollectionById ::: no colllection provided');
		}
	},

	getModelsFromCollectionByPropertyMatch: function(collection, property_to_match, value_to_match)
	{
		// console.log('getModelFromCollectionByPropertyMatch ::: property_to_match = ' + property_to_match);

		var models_to_return = [];

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if ( collection.models[i].get(property_to_match) === value_to_match ) 
				{
					models_to_return.push(collection.models[i]);
				};
			}
			
			return models_to_return;
		}
		else
		{
			return console.log('getModelFromCollectionById ::: no colllection provided');
		}
	},

	getModelsArrayByIdFromCollection: function(ids_array, collection, debug)
	{
		// console.log('getModelsArrayByIdFromCollection:');

		// console.log('ids_array: ' + ids_array);
		// console.dir(ids_array);

		if (collection)
		{
			var a = [];

			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				for (var w = ids_array.length - 1; w >= 0; w--) 
				{
					if (debug) {
						console.log('- comparing ' + String(ids_array[w]) + ': to ' + String(collection.models[i].get('_id')));
					};
					
					if (String(ids_array[w]) === String(collection.models[i].get('_id')))
					{
						if (debug) {
							console.log('found');
						};
						a.push( collection.models[i] );
					};
				};
			};

			return a;
		}
		else
		{
			console.log('getModelsArrayByIdFromCollection: collection is undefined');
		}
	},

	getArrayForDropdownFromCollection: function(title_property, collection)
	{
		var a = [];

		for (var i = collection.models.length - 1; i >= 0; i--) 
		{
			a.push(
			{
				id: 	collection.models[i].get('_id'),
				title: 	collection.models[i].get(title_property)
			});
		};
		console.log('getArrayForDropdownFromCollection ::: a:');
		console.dir(a);

		return a;
	},

	getFiltersList: function(collection, apply_i18n)
	{
		var objects_to_return = [];

		for (var i = collection.models.length - 1; i >= 0; i--) 
		{
			console.log('i = ' + i);

			var new_filter = {};

			if (apply_i18n) 
			{
				new_filter.name = this.getI18StringFromModel(collection.models[i], 'i18n_title');
			}
			else
			{
				new_filter.name = collection.models[i].get('title');
			}

			new_filter.id = collection.models[i].get('_id');

			objects_to_return.push(new_filter);
		};

		return objects_to_return;
	},

	createModel: function(collection, options, success_handler, error_handler)
	{
		if (!options) {
			var options = {};
		};

		collection.create(options,
		{
			success: function(something){
				console.dir(something);
				$.ambiance({ message: i18n.getI18NStringUppercase('op_model_create_success'), type: 'default' });
				if (success_handler) { success_handler() };
			},
			error: function(){
				$.ambiance({ message: i18n.getI18NStringUppercase('op_model_create_error'), type: 'error' });
				if (error_handler) { error_handler() };
			}
		});
	},

	saveModel: function(model, success_handler, error_handler)
	{
		model.save({},
		{
			success: function(){
				$.ambiance({ message: i18n.getI18NStringUppercase('op_model_save_success'), type: 'success' });
				if (success_handler) { success_handler() };
			},
			error: function(){
				$.ambiance({ message: i18n.getI18NStringUppercase('op_model_save_error'), type: 'error' });
				if (error_handler) { error_handler() };
			}
		});
	},

	modalImage: function(image_url)
	{
		modal.createModal(
		{
			showImage 			: false,
			imageURL 			: image_url
		});	
	},

	destroyModel: function(model, success_handler, error_handler)
	{
		modal.createModal(
		{
			titleText			: i18n.getI18NString('delete_element'),
			textText			: i18n.getI18NString('press_ok_to_confirm'),
			confirmButtonText 	: 'OK',
			cancelButtonText 	: i18n.getI18NString('cancel'),
			confirmButtonColor 	: '#34C3BF',
			cancelButtonColor 	: '#C0392B',
			fontFamily 			: 'Open Sans',
			confirmCallback: function()
			{
				model.destroy(
				{
					success: function(){
						$.ambiance({ message: i18n.getI18NStringUppercase('op_model_destroy_success'), type: 'default' });
						if (success_handler) { success_handler() };
					},
					error: function(){
						$.ambiance({ message: i18n.getI18NStringUppercase('op_model_destroy_error'), type: 'error' });
						if (error_handler) { error_handler() };
					}
				});
			},
		});	
	},

	destroyElementDialog: function(confirmCallback)
	{
		modal.createModal(
		{
			titleText			: i18n.getI18NString('delete_element'),
			textText			: i18n.getI18NString('press_ok_to_confirm'),
			confirmButtonText 	: 'OK',
			cancelButtonText 	: i18n.getI18NString('cancel'),
			confirmButtonColor 	: '#34C3BF',
			cancelButtonColor 	: '#C0392B',
			fontFamily 			: 'Open Sans',
			confirmCallback 	: confirmCallback
		});	
	},

	showWarningModal: function(warning_message)
	{
		modal.createModal(
		{
			titleText				: i18n.getI18NString('warning'),
			textText				: warning_message,
			confirmButtonText 		: 'OK',
			showCancelButton 		: false,
			showConfirmButton 		: true,
			defaultCancelIsClose	: false,
			defaultOKIsClose		: true,
			fontFamily 				: 'Open Sans'
		});	
	},

	createTextEditor: function(element)
	{
		return new Pen(
		{
			list: ['h2', 'bold', 'italic', 'underline', 'createlink'],
			editor: element,
			stay: false,
		});
	},

	disableRightSideBar: function()
	{
		var right_sidebar = document.getElementById('right-sidebar');
		right_sidebar.addClass('off');

		MarionetteApp.rightSidebarRegion.$el.hide();

		window.adjustViewPort();
	},

	enableRightSideBar: function()
	{
		var right_sidebar 			= document.getElementById('right-sidebar');
		var right_sidebar_content 	= document.getElementById('right-sidebar-content');
		
		right_sidebar_content.style.display = 'block';

		right_sidebar.removeClass('off');

		window.adjustViewPort();
	},

	destroyTextEditor: function(editor_instance)
	{
		if (editor_instance)  { editor_instance.destroy(); };
	},

	getArrayForDropdown: function(type)
	{
		var a = [];

		a = this.getArrayFromType(type);

		return a;
	},

	getSelectedValueForDropdown: function(id, type)
	{
		var a = [];

		a = this.getArrayFromType(type);

		for (var i = a.length - 1; i >= 0; i--) 
		{
			if (a[i].id == id)
			{
				return a[i].title;
			}
		};

		return a[0].title;
	},

	getArrayFromType: function(type)
	{
		// TODO: switch to DB

		switch(type)
		{
			case 'commodities':
				return [
				{
					title: 'Geral',
					id: 0
				}, 
				{
					title: 'Alojamento',
					id: 1
				}, 
				{
					title: 'Restauração',
					id: 2
				}, 
				{
					title: 'Actividades',
					id: 3
				}, 
				{
					title: 'Eventos',
					id: 4
				}];
			break;
			case 'contacts':
				return [
				{
					title: 'Email',
					id: 0
				}, 
				{
					title: 'Phone',
					id: 1
				}, 
				{
					title: 'Address',
					id: 2
				}];
			break;
			case 'socialnetworks':
				return [
				{
					title: 'Facebook',
					id: 0
				},
				{
					title: 'Twitter',
					id: 1
				},
				{
					title: 'Google',
					id: 2
				},
				{
					title: 'Pinterest',
					id: 3
				},
				{
					title: 'Linkedin',
					id: 4
				},
				{
					title: 'Myspace',
					id: 5
				},
				{
					title: 'Instagram',
					id: 6
				},
				{
					title: 'Tumblr',
					id: 7
				},
				{
					title: '500px',
					id: 8
				},
				{
					title: 'Flickr',
					id: 9
				},
				{
					title: 'Blogger',
					id: 10
				}];
			break;
		}
	},


	elementExistsInArray: function(value, array, usecase)
	{	
		// alogMatch(true, usecase, 'elementExistsInArray:');
		// alogMatch(true, usecase, 'array:');
		// adirMatch(true, usecase, array);

		if (array) {
			
			// alogMatch(true, usecase, 'in:');

			for (var i = array.length - 1; i >= 0; i--) 
			{
				// alogMatch(true, usecase, 'i: ' + i);
				// alogMatch(true, usecase, 'value: ' + value);
				// alogMatch(true, usecase, 'array[i]: ' + array[i]);
				// alogMatch(true, usecase, 'typeof value: ' + typeof value);
				// alogMatch(true, usecase, 'typeof array[i]: ' + typeof array[i]);

				if (String(array[i]) === String(value)) 
				{
					// alogMatch(true, usecase, 'TRUE');
					return true;
				};
			};
		};
		
		return false;
	},

	updateI18NString: function(model, property, new_value)
	{
		var assigned = false;

		for (var i = model.get(property).length - 1; i >= 0; i--) 
		{
			if (model.get(property)[i].lang === editor_current_lang) 
			{

				model.get(property)[i].value = new_value;

				assigned = true;
			};
		};

		if (!assigned) 
		{
			model.get(property).push( { lang: editor_current_lang, value: new_value } );
		};
		// console.log('updateI18NString - didnt find suitable property');
	},

	getMenuItemsFromCMSCollectionsByAccount: function(account_collections, cms_collections, session_locale)
	{
		console.log('getMenuItemFromCMSCollectionsByAccount');
		
		// console.log('account:');
		// console.dir(account_collections[0]);

		// console.log('cms_collections:');
		// console.dir(cms_collections[0]);

        var menu_values = [];

        var has_content_items = false;
        var has_settings_items = false;

        for (var i = account_collections.length - 1; i >= 0; i--) 
        {
			for (var w = cms_collections.length - 1; w >= 0; w--) 
			{	
				// console.log('comparing ' + account_collections[i] + ' with ' + String(cms_collections[w]._id));

        		if (String(account_collections[i]) === String(cms_collections[w]._id))
        		{
					var new_menu_value 				= {};

					new_menu_value.title 			= this.getI18NPropertyFromObjectByLang('i18n_title', cms_collections[w], session_locale);
					new_menu_value.icon_name 		= cms_collections[w].icon_name;
					new_menu_value.icon_lib 		= cms_collections[w].icon_lib;
					new_menu_value.menu_class 	 	= cms_collections[w].menu_class;

					if (new_menu_value.menu_class == 'content') {
						has_content_items = true;	
					};

					if (new_menu_value.menu_class == 'settings') {
						has_settings_items = true;	
					};
					
					new_menu_value.router_key 	 	= cms_collections[w].router_key;
					new_menu_value.id 				= cms_collections[w]._id;

					menu_values.push(new_menu_value);
        		};
			}
        };

		// for (var i = cms_collections.length - 1; i >= 0; i--) 
		// {
		// 	if (this.ifElementExistsInArray(cms_collections[i]._id, cms_collections))
		// 	{
		// 	};
		// };

		return [menu_values, has_content_items, has_settings_items];
	},

	createModelDefinition: function(api_url, custom_url)
	{
		console.log('::: createModelDefinition :::');
		console.log('api_url: ' + api_url);
		console.log('custom_url: ' + custom_url);

		if (custom_url) 
		{
			return Backbone.Model.extend(
	        {
	            idAttribute: "_id",
	            urlRoot: api_url,
	            url: custom_url
	        });
		} 
		else 
		{
			return Backbone.Model.extend(
	        {
	            idAttribute: "_id",
	            urlRoot: api_url,
	            url: function() 
			    {
			        if(this.id) { return api_url + this.id; }
			        return api_url;
			    },
	        });
		}
	},

	createCollectionDefinition: function(model, api_url, filtered)
	{
		console.log('::: createCollectionDefinition :::');
		console.log('model: ' + model);
		console.log('api_url: ' + api_url);
		console.log('filtered: ' + filtered);
		
		if (!filtered) 
		{
			return Backbone.Collection.extend(
	        {
	            model 	: model,
	            url 	: api_url,
			    comparator: function(ab) {
			        return -ab.id;
			    },
			    byIndex: function(ab) {
			        return ab.get('index');
			    }
	        });
		}
		else
		{
			var filtered_collection = Backbone.Collection.extend(
	        {
	            model 		: model,
	            url 		: api_url,
	            sort 		: true,
			    comparator: function(ab) {
			        return -ab.id;
			    },
			    byIndex: function(ab) {
			        return ab.get('index');
			    },
			    filtered: function(property, value)
			    {
			        return filtered_objects = this.filter(function(model)
			        {
			            return model.get(property) === value;
			        });
			        return new filtered_collection(filtered_objects);
			    }  
	        });

	        return filtered_collection;
		}
	},

	ifElementExistsInArray: function(input_element, array)
	{
		for (var i = array.length - 1; i >= 0; i--) 
		{
			if (array[i] === input_element)
			{
				return true;
			};
		};

		return false;
	},

	getI18NPropertyFromObjectByLang: function(property, object, lang)
	{
		// console.log('getI18NPropertyFromObject ::: property = ' + property);
		// console.log('getI18NPropertyFromObject ::: object = ' + object);
		// console.log('getI18NPropertyFromObject ::: lang = ' + lang);

		object = object[property];
		
		if (object)
		{

			// console.log('getI18NPropertyFromObject ::: 1 object = ' + object + ' length: ' + object.length);
			if (object.length !== 0)
			{
				// console.log('getI18NPropertyFromObject ::: 2');
				for (var i = object.length - 1; i >= 0; i--) 
				{
					// console.log('getI18NPropertyFromObject ::: 3');
					if (object[i].lang === lang)
					{
						// console.log('getI18NPropertyFromObject ::: 4 object.length[i].value = ' + object[i].value);
						return object[i].value;
					};
				};
			}
		}
		else
		{
			// console.log('getI18NPropertyFromObject ::: NO VALUES!');
		}

		// console.log('getI18NPropertyFromObject ::: returning empty string...');
		return '';
	},
	getI18StringFromModel: function(model, property)
	{
		// console.log('getI18StringFromModel ::: model = ' + model);
		// console.log('getI18StringFromModel ::: property = ' + property);
		// console.log('getI18StringFromModel ::: editor_current_lang = ' + editor_current_lang);
		
		if (model)
		{
			var values = model.get(property);

			if (values)
			{
				// console.log('getI18StringFromModel ::: 1 values = ' + values + ' length: ' + values.length);
				if (values.length !== 0)
				{
					// console.log('getI18StringFromModel ::: 2');
					for (var i = values.length - 1; i >= 0; i--) 
					{
						// console.log('getI18StringFromModel ::: 3');
						if (values[i].lang === editor_current_lang)
						{
							// console.log('getI18StringFromModel ::: 4 values.length[i].value = ' + values[i].value);
							return values[i].value;
						};
					};
				}
			}
			else
			{
				// console.log('getI18StringFromModel ::: NO VALUES!');
			}
		}

		// console.log('getI18StringFromModel ::: returning empty string...');
		return '';
	},
	
	getI18StringFromModelForApp: function(model, property)
	{
		if (model)
		{
			var values = model.get(property);

			if (values)
			{
				if (values.length !== 0)
				{
					for (var i = values.length - 1; i >= 0; i--) 
					{
						if (values[i].lang === window.app_current_lang)
						{
							return values[i].value;
						};
					};
				}
			}
			else
			{
				// console.log('getI18StringFromModel ::: NO VALUES!');
			}
		}

		return '';
	},


	getModelValueSafely_Uppercase: function(model, property)
	{
		// console.log('getModelValueSafely ::: property: '+ property);
		// console.log('getModelValueSafely ::: model: '+ model);
		// console.log('getModelValueSafely ::: .get(property): '+ model.get(property));

		var string = this.getModelValueSafely(model, property);

		return string.charAt(0).toUpperCase() + string.slice(1);
	},


	getModelValueSafely: function(model, property)
	{
		// console.log('getModelValueSafely ::: property: '+ property);
		// console.log('getModelValueSafely ::: model: '+ model);
		// console.log('getModelValueSafely ::: .get(property): '+ model.get(property));
		// console.log('getModelValueSafely ::: model---------------------');
		// console.log('getModelValueSafely ::: model _id: ' + model.get('physical_index'));
		// console.log('getModelValueSafely ::: model dir:');
		// console.dir(model);

		if (model) {
			// console.log('1');
			if (model.get(property)) {
				// console.log('2');
				return model.get(property);
				// console.log('3');
			}; return '';
			// console.log('4');
		}; return '';
		// console.log('5');
	},

	getMenuItemsFromDependencies: function(dependencies_collections_indexes, current_router_key)
	{
		var menu_items = [];

		for (var i = App.collections.cms_collections.models.length - 1;  i >= 0; i--) 
		{
			for (var x = dependencies_collections_indexes.length - 1; x >= 0; x--)
			{
				var dep_id = String(dependencies_collections_indexes[x].id);
				var col_id = String(App.collections.cms_collections.models[i].get('_id'));

				if (dep_id === col_id)
				{
					var new_menu_item 					= {};

					new_menu_item.id 					= String(App.collections.cms_collections.models[i].get('_id'));
					new_menu_item.title 				= this.getI18StringFromModelForApp(App.collections.cms_collections.models[i], 'i18n_title');
					new_menu_item.router_key 			= String(App.collections.cms_collections.models[i].get('router_key'));
					new_menu_item.router_key_single 	= String(App.collections.cms_collections.models[i].get('router_key_single'));
					new_menu_item.icon_name 			= String(App.collections.cms_collections.models[i].get('icon_name'));
					new_menu_item.icon_lib 				= String(App.collections.cms_collections.models[i].get('icon_lib'));
					new_menu_item.api_url_model 		= String(App.collections.cms_collections.models[i].get('api_url_model'));
					new_menu_item.api_url_collection 	= String(App.collections.cms_collections.models[i].get('api_url_collection'));
					new_menu_item.view_name 			= String(App.collections.cms_collections.models[i].get('view_name'));

					new_menu_item.active = false;
					
					console.log('- comparing ' + new_menu_item.router_key + ' to ' + current_router_key);

					if (current_router_key) {
						if (current_router_key === new_menu_item.router_key) {
							console.log('settings ACTIVE');
							new_menu_item.active = true;
					}};

					menu_items.push(new_menu_item);

				};
			};
		};
		
		return menu_items;
	},

	getCMSCollectionIDByPhysicalIndex: function(given_index)
	{
		for (var x = App.collections.cms_collections.models.length - 1; x >= 0; x--) 
		{
			// console.log('getCMSCollectionIDByPhysicalIndex ::: looping');

			var current_collection_id 				= App.collections.cms_collections.models[x].get('_id');
			var current_collection_physical_index 	= App.collections.cms_collections.models[x].get('physical_index');

			if (String(given_index) === String(current_collection_physical_index))
			{
				// console.log('getCMSCollectionIDByPhysicalIndex ::: FOUND D D D D D D');
			
				return current_collection_id;
			};
		};
	},

	invokeFetchCollection: function(collectionInstance, callback)
	{
		window.nprogress.start();

		collectionInstance.fetch({
			
			success: function (collection, response, options) { 
				// console.log('COLL GRABBED collection:');
				// console.dir(collection);

				window.nprogress.done();

				if (callback) { callback(collection); };
			},

			error: function (collection, response, options) {
	            // you can pass additional options to the event you trigger here as well
	            // self.trigger('errorOnFetch');
	            console.log('errorrrrr fetch colllection');
	            if (callback) { callback(null); };
	        },
	    });
	},

	getUsernameFromModel: function(model)
	{
		if (model) {
			if (model.get('local')) {
				// console.log('getUsernameFromModel ::: model.get(local).username:' + model.get('local').username);
			}
			else
			{
				// console.log('getUsernameFromModel ::: NO NO NO model.get(local)');
				console.dir(model);
			}


			if (model) {
				if (model.get('local')) {
					return model.get('local').username;
				}; return console.log('getUsernameFromModel ::: no local property in given model');
			}; return console.log('getUsernameFromModel ::: no model given');
		}
		else
		{
			// console.log('getUsernameFromModel ::: NO MODEL GIVEN');
		}
	},

	getEmailFromModel: function(model)
	{
		if (model) {
			if (model.get('local')) {
				return model.get('local').email;
			}; return console.log('getEmailFromModel ::: no local property in given model');
		}; return console.log('getEmailFromModel ::: no model given');
	},

	getDropdownActiveItem: function(dropdownEl)
	{
		var id_to_return = '';

		dropdownEl.find('.ui-dropdown-item').each(function()
		{
			var element = $(this);
			
			if (element.hasClass('active')) 
			{
				id_to_return = element.data('id');
				return element.data('id');

				// return;
			}
		});

		return id_to_return;
	},

	getHighlightedImageFromGalleryByGalleryID: function(gallery_id)
	{
		for (var i = App.collections.galleries.models.length - 1; i >= 0; i--)
		{
			var current_gallery = App.collections.galleries.models[i];

			if (gallery_id === current_gallery.get('_id'))
			{
				var highlighted_media_model = this.getModelFromCollectionById( App.collections.medias, current_gallery.get('cover_media_id') );

				var object_to_return =
				{
					id: 	highlighted_media_model.get('_id'), 
					url: 	"http://abwa.io/" + highlighted_media_model.get('url'),
					title: 	this.getI18StringFromModel(highlighted_media_model, 'i18n_url'),
				};
				
				return object_to_return;
			};
		};
	},

	highlightSelectedFilter: function(view, highlighted_category_id)
	{
		console.log('highlightSelectedFilter ::: highlighted_category_id = ' + highlighted_category_id);

		view.$el.find('.list-filter').each(function()
		{
			var element = $(this);
			
			console.log('found id = ' + element.data('id'));

			if (String(element.data('id')) === String(highlighted_category_id)) 
			{ 
				element.addClass('active'); 

				console.log('ASSIGN'); 
			};
		});
	},

	getCollectionTitlesArray: function(collection, apply_i18n)
	{
		var return_array = [];

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				var new_title;

				if (apply_i18n) { 
					new_title = this.getI18StringFromModel(collection.models[i], 'i18n_title');
				}
				else { 
					new_title = collection.models[i].get('title'); 
				}

				if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

				return_array.push({
					id: 	collection.models[i].get('_id'),
					title: 	new_title
				});
			}
		}
		else
		{
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	getModelsTitlesArray: function(models, apply_i18n)
	{
		var return_array = [];

		if (models) 
		{
			for (var i = models.length - 1; i >= 0; i--) 
			{
				var new_title;

				if (apply_i18n) { 
					new_title = this.getI18StringFromModel(models[i], 'i18n_title');
				}
				else { 
					new_title = models[i].get('title'); 
				}

				if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

				return_array.push({
					id: 	models[i].get('_id'),
					title: 	new_title
				});
			}
		}
		else
		{
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	getCollectionPropertyArray: function(collection, property, apply_i18n)
	{
		var return_array = [];

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				var new_title;

				if (apply_i18n) { 
					new_title = this.getI18StringFromModel(collection.models[i], property);
				}
				else { 
					new_title = collection.models[i].get(property); 
				}

				if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

				return_array.push({
					id: 	collection.models[i].get('_id'),
					title: 	new_title
				});
			}
		}
		else
		{
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	getCollectionTitlesArrayByIds: function(ids, collection,  apply_i18n)
	{
		// console.log('::: getCollectionTitlesArrayByIds :::');
		var return_array = [];

		var models = this.getModelsFromCollectionById(ids, collection);

		// console.log('models:');
		// console.dir(models);

		if (models) 
		{
			for (var i = models.length - 1; i >= 0; i--) 
			{
				var new_title;

				if (apply_i18n) { 
					new_title = this.getI18StringFromModel(models[i], 'i18n_title');
				}
				else { 
					new_title = models[i].get('title'); 
				}

				if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

				return_array.push({
					id: 	models[i].get('_id'),
					title: 	new_title
				});
			}
		}
		else
		{
			console.log('getCollectionTitlesArrayByIds ::: no models found!');
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	getModelsArrayTitles: function(array, apply_i18n)
	{
		var return_array = [];

		if (array) 
		{
			for (var i = array.length - 1; i >= 0; i--) 
			{
				var new_title;

				if (apply_i18n) { 
					new_title = this.getI18StringFromModel(array[i], 'i18n_title');
				}
				else { 
					new_title = array[i].get('title'); 
				}

				if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

				return_array.push(
				{
					id: 	array[i].get('_id'),
					title: 	new_title
				});
			}
		}
		else
		{
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	getCollectionTitlesArrayWithParameter: function(collection, property, value, apply_i18n)
	{
		console.log('getCollectionTitlesArrayWithParameter :::');

		var return_array = [];

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				console.log('getCollectionTitlesArrayWithParameter ::: interate i: ' + i);
				console.log('compare collection.models[i].get(property): ' + collection.models[i].get(property));
				console.log('with                                      : ' + value);

				if (collection.models[i].get(property) === value)
				{
					console.log('match');
					var new_title;

					if (apply_i18n) { 
						new_title = this.getI18StringFromModel(collection.models[i], 'i18n_title');
					}
					else { 
						new_title = collection.models[i].get('title'); 
					}

					if (new_title == '') { new_title = i18n.getI18NString('untitled'); };

					console.log('new_title: ' + new_title);

					return_array.push({
						id: 	collection.models[i].get('_id'),
						name: 	new_title
					});
				};
			}
		}
		else
		{
			return [];
		}

		// console.log('return_array: '+ return_array);
		return return_array;
	},

	// propertyIsI18String: function(string)
	// {
	// 	if (string === 'title'
	// 	||  string === 'i18n_lead'
	// 	||  string === 'text'
	// 	||  string === 'content')
	// 	{ return true };
		
	// 	return false;
	// },

	getCollectionPropertyArrayComposite: function(property, attribute_array, collection, apply_i18n, exclude_id, usecase)
	{
		// alogMatch('master', usecase, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
		// alogMatch('master', usecase, 'getCollectionPropertyArrayComposite');

		// alogMatch('master', usecase, 'attribute_array: '+ attribute_array);
		// adirMatch('master', usecase, attribute_array);

		var return_array = [];

		if (collection) 
		{
			// alogMatch('master', usecase, 'collection.models.length: '+ collection.models.length);

			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get('_id') !== exclude_id)
				{
					// console.log('getCollectionPropertyArrayComposite ::: collection.models[i]:');
					// console.dir(collection.models[i]);

					var new_object = {};

					if (apply_i18n)
					{
						new_object.name = this.getI18StringFromModel(collection.models[i], property);
					}
					else
					{
						new_object.name = collection.models[i].get(property);
					}

					if (new_object.name === '') { new_object.name = i18n.getI18NString('untitled') };
					
					new_object.id = collection.models[i].get('_id');


					// alogMatch('master', usecase, 'trying to find match');
					// alogMatch('master', usecase, 'new_object.id: '+ new_object.id);
					// alogMatch('master', usecase, 'attribute_array: '+ attribute_array);
					// alogMatch('master', usecase, 'collection.models[i].get(property): '+ collection.models[i].get(property));
					// alogMatch('master', usecase, 'collection.models[i].get(_id): '+ collection.models[i].get('_id'));					

					if (this.elementExistsInArray(collection.models[i].get('_id'), attribute_array))
					{
						// alogMatch('elementExistsInArray: FOUND VALUE TO MATCH' ,'master', collection.models[i].get(property));

						new_object.state = 'active';
					}
					else
					{
						new_object.state = 'inactive';
					}

					return_array.push(new_object);
				};
			}
			
			// alogMatch('master', usecase, new_object);
		}
		else
		{
			return [];
		}


		// alogMatch('master', usecase, 'result:');
		// adirMatch('master', usecase, return_array);
		// alogMatch('master', usecase, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');

		return return_array;
	},

	getCollectionPropertyArrayCompositeThatMatchProperty: function(property, attribute_array, collection, property_match, value, apply_i18n)
	{
		// alogMatch('master', usecase, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
		// alogMatch('master', usecase, 'getCollectionPropertyArrayComposite');

		// alogMatch('master', usecase, 'attribute_array: '+ attribute_array);
		// adirMatch('master', usecase, attribute_array);

		var return_array = [];

		if (collection) 
		{
			// alogMatch('master', usecase, 'collection.models.length: '+ collection.models.length);

			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				// console.log('getCollectionPropertyArrayComposite ::: collection.models[i]:');
				// console.dir(collection.models[i]);

				if (collection.models[i].get(property_match) === value) 
				{
					var new_object = {}

					if (apply_i18n)
					{
						new_object.name = this.getI18StringFromModel(collection.models[i], property);
					}
					else
					{
						new_object.name = collection.models[i].get(property);
					}

					if (new_object.name === '') { new_object.name = i18n.getI18NString('untitled') };
					
					new_object.id = collection.models[i].get('_id');


					// alogMatch('master', usecase, 'trying to find match');
					// alogMatch('master', usecase, 'new_object.id: '+ new_object.id);
					// alogMatch('master', usecase, 'attribute_array: '+ attribute_array);
					// alogMatch('master', usecase, 'collection.models[i].get(property): '+ collection.models[i].get(property));
					// alogMatch('master', usecase, 'collection.models[i].get(_id): '+ collection.models[i].get('_id'));					

					if (this.elementExistsInArray(collection.models[i].get('_id'), attribute_array))
					{
						// alogMatch('elementExistsInArray: FOUND VALUE TO MATCH' ,'master', collection.models[i].get(property));

						new_object.state = 'active';
					}
					else
					{
						new_object.state = 'inactive';
					}

					return_array.push(new_object);
				};
			}
			
			// alogMatch('master', usecase, new_object);
		}
		else
		{
			return [];
		}


		// alogMatch('master', usecase, 'result:');
		// adirMatch('master', usecase, return_array);
		// alogMatch('master', usecase, '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');

		return return_array;
	},

	getUserDatabyIdMatch: function(id, collection)
	{
		console.log('getUserDatabyIdMatch ::: id = ' + id);

		if (collection)
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if ( collection.models[i].get('_id') === id ) 
				{
					var return_obj 			= {};
					var local_userdata 		= collection.models[i].get('local');

					return_obj.username 	= local_userdata.username;
					return_obj.email 		= local_userdata.email;

					return return_obj;
				};
			}
		}
		
		return {};
	},

	getCheckListValues: function(caller, listEl)
	{
		// console.log('getCheckListValues:');
		// console.log('caller: ' + caller);
		// console.log('listEl: ' + listEl);

		var activeChecks = [];
		
		listEl.find('.ui-checker').each(function()
		{
			// console.log('getCheckListValues: LOOPING');
			var element = $(this);
			// console.log('getCheckListValues: element: ' + element);
			// console.log('element.hasClass(active): ' + element.hasClass('active'));
			// console.dir(element);

			if (element.hasClass('active')) 
			{
				// console.log('getCheckListValues: FOUND element: ' + element.data('id'));
				activeChecks.push(element.data('id'));
			}
		});

		return activeChecks;
	},

	getCheckListFirstValue: function(caller, listEl, property)
	{
		var activeChecks = [];
		
		listEl.find('.ui-checker').each(function()
		{
			var element = $(this);

			if (element.hasClass('active')) 
			{
				return element.data('id');
			}
		});
	},

	getIdFromCollection_byPropertyMatch: function(property, value_to_match, collection)
	{
		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get(property) == value_to_match ) 
				{
					return collection.models[i].get('_id');
				};
			}
		}
		
		return '';
	},

	getPropertyFromCollection_byIdMatch: function(property, id_to_match, collection, force_result, force_result_data, apply_i18n)
	{
		// console.log('getPropertyFromCollection_byIdMatch ::::');

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get('_id') == id_to_match) 
				{
					// console.log('getPropertyFromCollection_byIdMatch :::: found one');
					// console.log('HERE GOES collection.models[i].get(property): ' + collection.models[i].get(property));
					if (apply_i18n) { 
						// console.log('getPropertyFromCollection_byIdMatch :::: needs i18n');
						return this.getI18StringFromModel(collection.models[i], property) 
					};
					return collection.models[i].get(property);
				};
			}
		}
		
		if (force_result)
		{
			// console.log('HERE GOEEES force_result_data ' + force_result_data);
			return force_result_data;
		};
	},

	getPropertyFromCollection_byPropertyMatch: function(property, value_to_match, property_to_get, collection, force_result, force_result_data, apply_i18n)
	{
		// console.log('getPropertyFromCollection_byPropertyMatch ::::');

		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get(property) == value_to_match) 
				{
					// console.log('getPropertyFromCollection_byPropertyMatch :::: found one');
					// console.log('HERE GOES collection.models[i].get(property): ' + collection.models[i].get(property));
					if (apply_i18n) { 
						// console.log('getPropertyFromCollection_byPropertyMatch :::: needs i18n');
						return this.getI18StringFromModel(collection.models[i], property_to_get) 
					};
					return collection.models[i].get(property_to_get);
				};
			}
		}
		
		if (force_result)
		{
			// console.log('HERE GOEEES force_result_data ' + force_result_data);
			return force_result_data;
		};
	},

	deleteModelFromCollectionById: function(collection, id)
	{
		if (collection) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get('_id') == id)
				{
					collection.models[i].destroy();

					return;
				};
			}
		}
	},

	simpleImageUpload: function(self, form, model_property, multiple)
	{
		// TODO: block ui
		
		form.ajaxSubmit(
        {
	        error: function(xhr) 
	        {
				// console.log('simpleImageUpload ::: Error: ' + xhr.status);
				$.ambiance({ message: i18n.getI18NStringUppercase('op_image_upload_error'), type: 'error' });
	        },

	        uploadProgress: function(event, position, total, percentComplete) 
	        {
		        // console.log('simpleImageUpload ::: upload progress: ' + percentComplete);
		    },

	        success: function(new_media) 
	        {
		        // console.log('simpleImageUpload ::: upload complete ::: new_media = ' + new_media);
		        // console.dir(new_media);
		        
		        if (multiple === true)
		        {
					self.model.get(model_property).push(new_media._id);
		        }
		        else
		        {
		        	functions.deleteModelFromCollectionById(App.collections_dynamic['medias'], self.model.get(model_property));
		        	self.model.set(model_property, new_media._id);
		        }
		        
		        App.collections_dynamic['medias'].fetch(
        		{
        			reset: true,
		            success: function (collection, response, options) 
		            {
		        		$.ambiance({ message: i18n.getI18NStringUppercase('op_image_upload_success'), type: 'success' });
				    	
		        		self.model.save();
					    self.render();
		            },
		            error: function (collection, response, options) 
		            {
		                self.model.save();
		                self.render();
		            }
        		});
	        }
		});
	 
		// stop the form from submitting and causing page refresh                                                                           
		// return false;
	},

	simpleImageUpload2: function(self, form, successCallback)
	{
		// TODO: block ui
		
		form.ajaxSubmit(
        {
	        error: function(xhr) 
	        {
				// console.log('simpleImageUpload ::: Error: ' + xhr.status);
				$.ambiance({ message: i18n.getI18NStringUppercase('op_image_upload_error'), type: 'error' });
	        },

	        uploadProgress: function(event, position, total, percentComplete) 
	        {
		        // console.log('simpleImageUpload ::: upload progress: ' + percentComplete);
		    },

	        success: function(new_media) 
	        {
		        // console.log('simpleImageUpload ::: upload complete ::: new_media = ' + new_media);
		        // console.dir(new_media);
		        
		        App.collections_dynamic['medias'].fetch(
        		{
        			reset: true,
		            success: function (collection, response, options) 
		            {
		        		$.ambiance({ message: i18n.getI18NStringUppercase('op_image_upload_success'), type: 'success' });
				    	
		        		successCallback(new_media);
		            },
		            error: function (collection, response, options) 
		            {
		                self.model.save();
		                self.render();
		            }
        		});
	        }
		});
	 
		// stop the form from submitting and causing page refresh                                                                           
		// return false;
	},

	imageUploadSingle: function(self, form, callBack)
	{
		this.submitAjaxForm(self, form, callBack, 'op_image_upload_success', 'op_image_upload_error')
	},

	submitAjaxForm: function(self, form, callBack, success_string, error_string)
	{
		form.ajaxSubmit(
        {
	        error: function(xhr) 
	        {
				$.ambiance({ message: i18n.getI18NStringUppercase(error_string), type: 'error' });
	        },

	        uploadProgress: function(event, position, total, percentComplete) 
	        {
		        // console.log('simpleImageUpload ::: upload progress: ' + percentComplete);
		    },

	        success: function(result) 
	        {
				$.ambiance({ message: i18n.getI18NStringUppercase(success_string), type: 'success' });

		        if (callBack) 
		        { 
		        	callBack(result); 
		        };
	        }
		});
	 
		// stop the form from submitting and causing page refresh                                                                           
		// return false;
	},

	getMixedMediasData: function(mixed_medias)
	{
		if (mixed_medias) 
		{
			for (var i = mixed_medias.length - 1; i >= 0; i--) 
			{
				if (!elements_to_return)
				{
					var elements_to_return = [];
				};

				// console.log('i: ' + i);
				var new_media 			= {};

				new_media.type 			= mixed_medias[i].type;
				new_media.id  			= mixed_medias[i].id;

				// console.log('new_media.type:');
				// console.dir(new_media.type);
				// if (new_media.type === 'image')
				// {
				// 	var current_model 	= this.getModelFromCollectionById(App.collections_dynamic['medias'], new_media.id);
				// }
				// else if (new_media.type === 'video')
				// {
				// 	var current_model 	= this.getModelFromCollectionById(App.collections_dynamic['medias'], new_media.id);
				// }

				var current_model 	= this.getModelFromCollectionById(App.collections_dynamic['medias'], new_media.id);

				new_media.title 		= this.getModelValueSafely(current_model, 	'title');
				new_media.i18n_title 	= this.getI18StringFromModel(current_model, 'i18n_title');
				new_media.i18n_lead 	= this.getI18StringFromModel(current_model, 'i18n_lead');
				new_media.i18n_text 	= this.getI18StringFromModel(current_model, 'i18n_text');
				new_media.url 			= this.getModelValueSafely(current_model, 	'url');
				// console.log('new_media.url:');
				// console.dir(new_media.url);
				// console.log('new_media:');
				// console.dir(new_media);
				elements_to_return.push(new_media);
			};
		}

		// console.log('getMixedMediasData ::: elements_to_return:');
		// console.dir(elements_to_return);
		// console.log('elements_to_return:');
		// console.dir(elements_to_return);

		return elements_to_return;
	},

	deleteModelsFromCollectionById: function(collection, ids_array)
	{
		if (collection) 
		{
			for (var j = ids_array.length - 1; j >= 0; j--) 
			{
				for (var i = collection.models.length - 1; i >= 0; i--) 
				{
					if (collection.models[i].get('_id') == ids_array[j])
					{
						collection.models[i].destroy();
					};
				}
			};
		}
	},

	deleteMediasByIds: function(ids_array)
	{
		var collection = App.collections_dynamic['medias'];

		for (var j = ids_array.length - 1; j >= 0; j--) 
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				if (collection.models[i].get('_id') == ids_array[j])
				{
					// kill media
					collection.models[i].destroy();
				};
			}
		};
	},

	getMediaDataFromID: function(given_id)
	{
		var collection = App.collections_dynamic['medias'];

		if (collection)
		{
			for (var i = collection.models.length - 1; i >= 0; i--) 
			{
				var current_element_id = collection.models[i].get('_id');

				if (current_element_id == given_id) 
				{
					var object_to_return = {};

					object_to_return.id 			= current_element_id;
					object_to_return.title 			= this.getModelValueSafely(collection.models[i], 'title');
					object_to_return.i18n_title 	= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_title');
					object_to_return.i18n_lead 		= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_lead');
					object_to_return.i18n_text 		= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_text');
					// object_to_return.base64 		= this.getModelValueSafely(collection.models[i], 'base64');
					object_to_return.url 			= this.getModelValueSafely(collection.models[i], 'url');
					object_to_return.originaldata 	= this.getModelValueSafely(collection.models[i], 'originaldata');
					// object_to_return.url 			= this.getPropertyFromCollection_byIdMatch('url', object_to_return.file_id, App.collections.files, false, '', false)

					return object_to_return;
				};
			}
		}
	},

	getGalleryImagesData: function(media_ids)
	{
		// console.log('getRelatedImagesFromGallery ::: get images data media_ids:');
		
		// console.dir(media_ids);
		// console.dir(App.collections_dynamic['medias']);

		var images_to_return = [];

		if (media_ids)
		{
			if (media_ids.length < 1) { return images_to_return };

			for (var j = 0; j <= media_ids.length - 1; j++) 
			{
				for (var i = App.collections_dynamic['medias'].models.length - 1; i >= 0; i--) 
				{
					var current_media_model = App.collections_dynamic['medias'].models[i];

					if (media_ids[j] === current_media_model.get('_id'))
					{
						// console.log('getRelatedImagesFromGallery ::: found image in gallery, attempting to add');
						// new_image_object.title 			= App.collections_dynamic['medias'].models[i].get('title');

						var new_image_object = {};

						new_image_object.type = 'image';

						new_image_object.id 			= current_media_model.get('_id');
						// new_image_object.title 			= this.getI18StringFromModel(current_media_model, 'i18n_title');
						new_image_object.title 			= this.getI18StringFromModel(current_media_model, 'i18n_title');
						new_image_object.lead 			= this.getI18StringFromModel(current_media_model, 'i18n_lead');
						new_image_object.text 			= this.getI18StringFromModel(current_media_model, 'i18n_text');
						new_image_object.type 			= current_media_model.get('type');
						new_image_object.url 			= current_media_model.get('url');
						new_image_object.originaldata 	= current_media_model.get('originaldata');
						new_image_object.key_color 		= current_media_model.get('key_color');
						new_image_object.align 			= current_media_model.get('align');
						new_image_object.active 		= current_media_model.get('active');
						new_image_object.model 			= current_media_model;
						// new_image_object.base64 		= current_media_model.get('base64');

						images_to_return.push(new_image_object);
					};
				};
			};
			
			console.log('IMAGES TO RETURN: ');
			console.dir(images_to_return);

			return images_to_return;
		}
	},

	// getGalleryImagesData: function(media_ids)
	// {
	// 	// console.log('getRelatedImagesFromGallery ::: get images data media_ids:');
		
	// 	// console.dir(media_ids);
	// 	// console.dir(App.collections_dynamic['medias']);

	// 	var images_to_return = [];

	// 	if (media_ids)
	// 	{
	// 		if (media_ids.length < 1) { return images_to_return };

	// 		for (var j = media_ids.length - 1; j >= 0; j--) 
	// 		{
	// 			for (var i = App.collections_dynamic['medias'].models.length - 1; i >= 0; i--) 
	// 			{
	// 				if (media_ids[j] === App.collections_dynamic['medias'].models[i].get('_id'))
	// 				{
	// 					// console.log('getRelatedImagesFromGallery ::: found image in gallery, attempting to add');
	// 					// new_image_object.title 			= App.collections_dynamic['medias'].models[i].get('title');

	// 					var new_image_object = {};

	// 					new_image_object.id 			= App.collections_dynamic['medias'].models[i].get('_id');
	// 					// new_image_object.title 			= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_title');
	// 					new_image_object.i18n_title 	= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_title');
	// 					new_image_object.i18n_lead 		= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_lead');
	// 					new_image_object.i18n_text 		= this.getI18StringFromModel(App.collections_dynamic['medias'].models[i], 'i18n_text');
	// 					new_image_object.url 			= App.collections_dynamic['medias'].models[i].get('url');
	// 					// new_image_object.base64 		= App.collections_dynamic['medias'].models[i].get('base64');
	// 					new_image_object.originaldata 	= App.collections_dynamic['medias'].models[i].get('originaldata');

	// 					images_to_return.push(new_image_object);
	// 				};
	// 			};
	// 		};
			
	// 		console.log('IMAGES TO RETURN: ');
	// 		console.dir(images_to_return);

	// 		return images_to_return;
	// 	}
	// },

	// var getAuthor = function(model)
	// {
		// console.log('getAuthor ::: model: '+ model);
		// console.log('getAuthor ::: .get(author): '+ model.get('author'));

	// 	if (model) {
	// 		if (model.get('author')) {
	// 			return model.get('author');
	// 		}; return '';
	// 	}; return ''
}