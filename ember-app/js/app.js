var ajax = ic.ajax;

App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

Ember.Handlebars.helper('upcase', function(value) {
  Ember.debug(value)
  if (!Ember.isEmpty(value)) {
    return value.toUpperCase();
  } else {
    return value;
  }
});

App.Attendee = Ember.Object.extend({
  name: null
});

App.Attendee.reopenClass({
  find: function() {
    return ajax('/api/attendees.json').then(function(data) {
      var records = Em.A([]);
      data.forEach(function(d) {
        records.pushObject(
          App.Attendee.create(d)
        );
      }.bind(this));
      return records;
    }.bind(this));
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Attendee.find();
  }
});

App.IndexController = Ember.ArrayController.extend({
  actions: {
    addAttendee: function() {
      var attendee = App.Attendee.create({ name: this.get('attendeeName') });
      this.pushObject(attendee);
    }
  }
});
