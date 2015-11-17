var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    locale : String,
    history : Array,
    lastLoginTime : Date,
    accountId : mongoose.Schema.Types.ObjectId,
    userVerifyOneTimeToken : String,
    expirationTime : { type: Number,   default: -1 },
    accessToken : String,
    lastPasswordChange : Date,
    password : String,
    lastName : String,
    firstName : String,
    role : String,
    email : String,
    userName : String,
    updatedTime : { type: String, default: null },
    failedLogins : Array,
    usedOneTimeTokens : Array,
    createdTime : { type: Date, default: Date.now() },
    settings : { type: Object,  default: {
            general : {
                showAllTicketTab : false
            },
            sidebarRight : {
                showUserFeedFirst : true,
                commentBarrier : 500
            },
            emails : {
                newTicket : false,
                sendAssignNotification : "always"
            }
        }
    },

    // new
    knownAddons : Array,
    enabledAddons : Array,
    pendingAddons : Array,
    imageURL : String,
});

module.exports = UserSchema = userSchema;

module.exports = User = mongoose.model('User', userSchema);

