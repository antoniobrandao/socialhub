var mongoose = require('mongoose');

var _addonSchema = mongoose.Schema({

    index 				: Number,
    name 				: String,
    title 				: String,
    description 		: String,
    imageRootURL 		: String,
    imageURL  			: { type: String, default: '' },
    needs_permission 	: { type: Boolean, default: false },
    date             	: { type: Date, default: Date.now() },
});

module.exports = AddonSchema = _addonSchema;

module.exports = Addon = mongoose.model('Addon', _addonSchema);

