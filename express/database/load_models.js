var fs 			= require('fs');
var path 		= require('path');

// only-scripts filter
var onlyScripts = function(name) {
    return /(\.(js)$)/i.test(path.extname(name));
};

var all_models_files  = fs.readdirSync(path.join(__dirname, 'models')).filter(onlyScripts);

all_models_files.forEach(function(file) 
{
	require('./models/' + file);
});