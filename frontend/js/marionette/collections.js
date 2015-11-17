
App.collectionDefinitions.Accounts = Backbone.Collection.extend({
    model: App.Models.AccountModel,
    url: '/api/accounts',
});

App.collectionDefinitions.Addons = Backbone.Collection.extend({
    model: App.Models.AddonModel,
    url: '/api/addons',
});

App.collectionDefinitions.Users = Backbone.Collection.extend({
    model: App.Models.UserModel,
    url: '/api/users',
});


module.exports = {

    getAccountsCollection: function(create_new)
    {
        if (create_new) {
            return new App.collectionDefinitions.Accounts();
        };
        return App.collectionDefinitions.Accounts;
    },

    getAddonsCollection: function(create_new)
    {
        if (create_new) {
            return new App.collectionDefinitions.Addons();
        };
        return App.collectionDefinitions.Addons;
    },

    getUsersCollection: function(create_new)
    {
        if (create_new) {
            return new App.collectionDefinitions.Users();
        };
        return App.collectionDefinitions.Users;
    },
}