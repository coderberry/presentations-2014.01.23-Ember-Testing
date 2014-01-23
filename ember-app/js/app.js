var ajax = ic.ajax;

App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

Ember.Handlebars.helper('upcase', function(value) {
  return value.toUpperCase();
});

App.Contact = Ember.Object.extend({});
App.Contact.reopenClass({
  find: function() {
    var url = "http://addressbook-api.herokuapp.com/contacts",
        contacts = Em.A([]);

    ajax(url).then(function(data) {
      data.contacts.forEach(function(c) {
        var contact = App.Contact.create(c);
        contacts.pushObject(contact);
      }.bind(this));
    }.bind(this));

    return contacts;
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Contact.find();
  }
});

App.IndexController = Ember.ArrayController.extend({
  actions: {
    addContact: function() {
      var name = this.get("name");
      this.pushObject(App.Contact.create({ first: name }));
      this.set("name", null);
    }
  }
});
