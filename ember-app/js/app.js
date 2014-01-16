// Config

App = Ember.Application.create();

App.Router.map(function() {
  this.resource('todos', { path: '/' });
});

// Models

App.Todo = Ember.Object.extend({
  title: null,
  isCompleted: null
});

App.Todo.reopenClass({
  find: function() {
    var results = [];
    $.getJSON('/api/todos.json').then(function(data) {
      data.todos.forEach(function(todoData) {
        results.pushObject(App.Todo.create(todoData));
      });
    }, function(jqXHR) {
      debugger;
    });
    return results;
  }
})

// Routes

App.TodosRoute = Ember.Route.extend({
  model: function() {
    return App.Todo.find();
  }
});

// Controllers

App.TodosController = Ember.ArrayController.extend({

});
