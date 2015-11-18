# socialhub addons microapp

## Usage

	git clone https://github.com/antoniobrandao/socialhub.git socialhub_test
	cd socialhub_test
	mongorestore -d socialhub_test dump 
	npm install
	gulp watch
	// open http://localhost:3000/ in Browser
	// Press CTRL-C twice to exit
	

# Workflow

## Build System

#### Gulp/Browserify watch/build system

The project runs on a Gulp/Browserify watch/build system. I included my usual Gulp folder/structure (similar to my setup in [https://github.com/antoniobrandaodesign/ab_boilerplate](https://github.com/antoniobrandaodesign/ab_boilerplate)) and adapted the tasks to this project.

I use regular JavaScript, Stylus for the CSS and the "jadeify" Browserify transform to use JADE templates on the frontend as well (tempaltes to use in the Backbone views).

See the tasks in gulp/watch.js and gulp/build.js for reference. They are pretty easy to understand.

All processed files go either to "builds/development" or to "builds/production" depending on the set environment.

## Backend 

#### Scaffold a new Express project

Used the NPM module generator-express to scaffold a clean Express app (https://www.npmjs.com/package/generator-express). 

#### BrowserSync & gulp-nodemon

Configured BrowserSync with gulp-nodemon to watch backend and frontend files. Nodemon takes care of restarting Express every time I change backend JavaScript files. BrowserSync handles frontend files, injecting changed CSS and reloading the browser when JavaScript files are changed.

Express is listening to port 5000 and BrowserSync is set to proxy: 3000, so we open the app at localhost:3000.

#### DB, Mongoose & Startup

- Placed the "dump" folder in the project root and created the database by running "mongorestore -d socialhub_test dump".
- Added Mongoose & created the database connection (db_connect.js)
- Adjusted the start sequence to make Express listen to requests only after a connection to the database is established

#### File uploads (for the optional images)

Intalled the multer module to handle file uploads. On the frontend I added the jquery_form plugin to handle the respective upload form.

#### Express Routes, Models & Middleware

- Cleaned up the default "index" route
- Created Addon, Account, and User models.
- Created the respective GET / POST / PUT / DELETE / "list" routes for each in the file "api.js".
- Created a POST route for the file uploads
- Created the methods to handle those requests in the folder "controllers"
- Included some simple middleware that helps handling those requests

#### Socket.io (Express)

Added the socket.io module and created a file to handle it (socket.js). 

This socket expects two events from the front-end: "send_email" & "create_addon"

It uses two controllers (controllers/email, controllers/create_addon) to handle the events.

#### Nodemailer

Added nodemailer to handle emails and created a file to handle it (controllers/email.js)
  
# Frontend

#### File Folder

All frontend files are located in the "frontend" folder.

#### Why JADE in the Frontend?

It's pleasant and beneficial to use the same HTML syntax in both the Backend and Frontend.

#### CSS (Stylus)

I'm just using 3 Stylus files for this tiny project. A main file "index.styl", a "reset.styl", and a "mixins.styl". Their names makes their purposes clear. I didn't bother to make more individual files because this is a really small project. Two extra files (plugin styles) are also imported.

Why Stylus? Stylus, like JADE, was created by the same person who created Express (TJ Holowaychuk), and they make sense together. JADE and Stylus look similar which makes code more homogenous.

#### Base JavaScript

- index.js - This is the root - imports the "frontend" app, and jquery. Sets up the "frontend" app to start on the DOM "ready" event.
- frontend.js - This is the actual app. It has 4 responsibilities:
	- Import required files and modules
	- Receive DOMReady event to start marionette application
	- House a series of utility functions and variables that will be available throughout the app
	- Hold the socket listener (which listens to the "created_addon" event)

#### Backbone / Marionette

I also dropped in a folder structure I usually use in small projects:

- marionette/
	- views/ - The folder holding all the views
	- application.js - Marionette application creation & startup
	- behaviours.js - Functions to handle interactions (for backbone views only)
	- collections.js - Declare all the collections we expect to use
	- models.js - Declare all the models we expect to use
	- router.js - Handles the two routes we have
	- views.js - Imports views from the views/ folder
	
#### Socket

In the file "frontend.js" we listen to the "addon_created" event coming from Express. When this event is received, we add a new Addon Model to the collection in memory, triggering an update on the list (or, if we are not in the Addons Page, triggering an update in the numerical badge in the "Addons Page" menu item).

In the file "frontend.js" we have two functions that emit socket events, these are "sendNotificationEmail", and the click event listener that is set in the "domReady" function.

#### On load

On every load of the application (or page refresh) we:

- check if there are unknown Addons (Addons the user hasn't seen yet) and:
	- If we are in the Addons Page - Highlight the new Addons so the user can perceive them
	- If we are in another page - Update the numerical badge on the "Addons Page" menu item

## Further Information

I'm happy to provide further information. Let me know if you would like to know different or more specific details.