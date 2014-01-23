// in order to see the app running inside the QUnit runner
App.rootElement = '#ember-testing';

// Functions

function createView(template, context){
  if (!context) { context = {}; }
  var View = Ember.View.extend({
    controller: context,
    template: Ember.Handlebars.compile(template)
  });
  return View.create();
}

function append(view){
  Ember.run(function(){
    view.appendTo('#qunit-fixture');
  });
}

// Test Helpers
Ember.Test.registerHelper('shouldHaveElementWithCount', 
  function(app, selector, n, context) {
    var el = findWithAssert(selector, context);
    var count = el.length;
    equal(n, count, "found " + count + " times");
  }
);

Ember.Test.registerAsyncHelper('addContact',
  function(app, name, context) {
    fillIn("#name", name);
    click("button.create");
  }
);

// Common test setup
App.setupForTesting();
App.injectTestHelpers();

