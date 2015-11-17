
App.Models.AccountModel = Backbone.Model.extend(
{
    idAttribute: "_id",
    urlRoot: '/api/account/',
    url: function()  {
        if(this.id) { return '/api/account/' + this.id; }
        return '/api/account';
    },
});

App.Models.AddonModel = Backbone.Model.extend(
{
    idAttribute: "_id",
    urlRoot: '/api/addon/',
    url: function()  {
        if(this.id) { return '/api/addon/' + this.id; }
        return '/api/addon';
    },
});

App.Models.UserModel = Backbone.Model.extend(
{
    idAttribute: "_id",
    urlRoot: '/api/user/',
    url: function()  {
        if(this.id) { return '/api/user/' + this.id; }
        return '/api/user';
    },
});