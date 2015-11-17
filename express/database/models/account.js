var mongoose = require('mongoose');

var _accountSchema = mongoose.Schema({

    hubVersion : String,
    createdTime : Date,
    package : String,
    expirationTime : Date,
    history : { type: Array,  default: [ { type : "enabled", time : Date } ], },
    tags : Array,
    features : { type: Object,  default: {
	        approvalProcess : false,
	        insightsUserActions : false,
	        coworking : true,
	        categories : false,
	        categoriesForceUserToTag : false,
	        templates : false,
	        cp_beta : true
    	}
	},
    premiumFeatures : { type: Object,  default: {
	        security : false
	    }
	},
    name : String,
    locale : { type: String,   default: 'de' },
    appId : String,
    realtimeAppId : String,
});

module.exports = AccountSchema = _accountSchema;

module.exports = Account = mongoose.model('Account', _accountSchema);