// jquery used for Backbone and 'ready' event
window.$ = window.jQuery = require('jquery');

// The app itself is stored in the window, exposing methods and variables
window.frontend_app = require('./frontend');

// execute window.frontend_app.domReady() when DOM is ready
$( document ).ready( window.frontend_app.domReady );