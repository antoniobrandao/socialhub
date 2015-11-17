
// my marionette application
var marionette = require('./marionette/application');

// socket
var client = require("socket.io-client"); 
var socket = client.connect("http://localhost:5000");

// utils
require('ab-element'); // dom element extensions
window.modal = require('ab-modal'); // ab modal module

// templates
var email_template = require("./templates/email_template.jade");

// loading bar
window.nprogress = require('nprogress-npm');

// notifications plugin
require('./plugins/ambiance/jquery.ambiance.js');

// jquery ajaxSubmit for image upload
require('./plugins/jquery_form/jquery_form.js');

module.exports = {

    // this variable is used to update the numerical badge on the "Addons Page" menu item
    unseen_new_addons: [],

    // executed on jquery's "ready"
    domReady: function()
    {
        console.log('DOM Ready ::: App started');
        
        // setup and startup marionette
	    marionette.init();
	    marionette.startup();

        // setup navigation buttons
        var navigation_buttons = document.querySelectorAll('.navigation-item');
        for (var i = 0; i <= navigation_buttons.length - 1; i++) {
            navigation_buttons[i].addEventListener('click', function(e) {
                var button_route = e.currentTarget.getAttribute('data-route');
                App.Marionette.router.navigate( button_route, {trigger: true} );
            });
        }

        // main_area's minHeight must be equal to window height
        var main_area = document.getElementById('main-area');
        main_area.style.minHeight = window.innerHeight + 'px';
        window.addEventListener('resize', function() {
            main_area.style.minHeight = window.innerHeight + 'px';
        });
        
        // set up button to add new Addons using the socket
        var add_addon_button = document.getElementById('add-addon-button');
        add_addon_button.addEventListener('click', function(e)
        {
            socket.emit('create_addon');
        });
    },

    // collections loader
    loadCollections: function(collections_names_array, callBack)
    {
        window.nprogress.start();

        var number_of_collections_left_to_load = collections_names_array.length;

        var loadingUnit = 1 / collections_names_array.length;
        var count = 1;

        var processCollection = function()
        {
            var current_collection_name = collections_names_array.pop();
            window.nprogress.set(count * loadingUnit);
            var new_collection = collections['get' + current_collection_name + 'Collection'](true);
                
            new_collection.fetch(
            {
                success: function (collection, response, options) { 
                    App.collections[ current_collection_name.toLowerCase() ] = collection;
                    if (collections_names_array.length > 0) {
                        count++;
                        processCollection();
                    } else {
                        window.nprogress.done();
                        callBack();
                    }
                },
                error: function (collection, response, options) {
                    console.log('loadCollections ::: error loading collection: ' + current_collection_name);
                    callback(null);
                },
            });
        }

        processCollection();
    },

    // sendNotificationEmail is called by App.Behaviours.ToggleEnableAddon
    sendNotificationEmail: function(addon_id)
    {
        console.log('sendNotificationEmail ::: addon_id: ' + addon_id);

        var account_name    = window.frontend_app.current_account_model.get('name');
        var account_id      = window.frontend_app.current_account_model.get('_id');

        var user_name       = window.frontend_app.current_user_model.get('userName');
        var user_email      = window.frontend_app.current_user_model.get('email');
        var user_id         = window.frontend_app.current_user_model.get('_id');

        var addon_model     = this.getCollectionElementByPropertyValue(App.collections.addons.models, '_id', addon_id);
        var addon_name      = addon_model.get('name');
        var addon_id        = addon_model.get('_id');

        var email_html = email_template(
        {
            account_name: account_name,
            account_id: account_id,

            user_name: user_name,
            user_email: user_email,
            user_id: user_id,

            addon_name: addon_name,
            addon_id: addon_id,
        });

        socket.emit('send_email', email_html);
    },

    // sendNotificationEmail is called by router
    highlightCurrentMenuButton: function( route )
    {
        // highlight current menu button
        var navigation_buttons = document.querySelectorAll('.navigation-item');
        for (var i = 0; i <= navigation_buttons.length - 1; i++) {
            var button_route = navigation_buttons[i].getAttribute('data-route');
            if ( route === button_route ) {
                navigation_buttons[i].addClass('active');
            } else {
                navigation_buttons[i].removeClass('active');
            }
        }
    },

    // called by AddonView
    getAddonState: function(id)
    {
        var currentEnabledAddons = window.frontend_app.current_user_model.get('enabledAddons');
        var currentPendingAddons = window.frontend_app.current_user_model.get('pendingAddons');

        if (currentEnabledAddons.indexOf(id) > -1) { 
            return 'active'; 
        } 
        else if (currentPendingAddons.indexOf(id) > -1) { 
            return 'pending';
        } else {
            return ''
        }
    },

    // called by router
    getUserUnseenAddons: function(model, success_handler, error_handler, skip_notification)
    {
        var knownAddons         = window.frontend_app.current_user_model.get('knownAddons');
        var allExistingAddons   = [];
        var newFoundAddons      = [];

        // create array containing IDs of unknown Addons, to highlight them in the UI
        for (var i = 0; i <= App.collections.addons.models.length - 1; i++) {
            var addon_i_id = App.collections.addons.models[i].get('_id');
            allExistingAddons.push(addon_i_id);
            if (knownAddons.indexOf(addon_i_id) === -1) {
                newFoundAddons.push(addon_i_id);
            }
        }

        return newFoundAddons;
    },

    updateBadge: function()
    {
        var badge_el = document.getElementById('addons-badge');

        badge_el.textContent = this.unseen_new_addons.length;

        if (this.unseen_new_addons.length > 0) {
            badge_el.addClass('active');
        } else {
            badge_el.removeClass('active');
        }
    },

    disableBadge: function()
    {
        var badge_el = document.getElementById('addons-badge');
        window.frontend_app.unseen_new_addons = [];
        badge_el.removeClass('active');
    },

    // generic
    getCollectionElementByPropertyValue: function(array, property_name, property_value)
    {
        for (var i = 0; i <= array.length - 1; i++) {
            if (array[i].get(property_name) === property_value) {
                return array[i];
            };
        }
    },

    // generic
    saveModel: function(model, success_handler, error_handler, skip_notification)
    {
        window.nprogress.start();
        model.save({},
        {
            success: function(){
                window.nprogress.done();
                if (!skip_notification) { $.ambiance({ message: 'SAVED', type: 'success' }); };
                if (success_handler) { success_handler() };
            },
            error: function(){
                window.nprogress.done();
                if (!skip_notification) { $.ambiance({ message: 'SAVE ERROR', type: 'error' }); };
                if (error_handler) { error_handler() };
            }
        });
    },

    // generic
    destroyModel: function(model, success_handler, error_handler, skip_notification)
    {
        window.nprogress.start();
        model.destroy(
        {
            success: function(){
                window.nprogress.done();
                if (!skip_notification) { $.ambiance({ message: 'REMOVED', type: 'success' }); };
                if (success_handler) { success_handler() };
            },
            error: function(){
                window.nprogress.done();
                if (!skip_notification) { $.ambiance({ message: 'REMOVE ERROR', type: 'error' }); };
                if (error_handler) { error_handler() };
            }
        });
    },
}


var self = module.exports;

// socket listener
socket.on("server_created_addon", function(new_addon_data)
{
   console.log('Frontend received Socket Event sent by Express ::: server_created_addon :::'); 

    App.collections.addons.add(new_addon_data);

    // if we are not in home (Addons Page), make sure the numerical badge showns the number of existing Addons which are unknown to the user
    if (Backbone.history.fragment !== '') {
        self.unseen_new_addons.push(new_addon_data._id);
        self.updateBadge();
    }
});


