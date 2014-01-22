// in order to see the app running inside the QUnit runner
App.rootElement = '#ember-testing';

// Common test setup
App.setupForTesting();

// Helpers

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

Ember.Test.registerHelper('shouldHaveElementWithCount', function(app, selector, n, context) {
  var el = findWithAssert(selector, context);
  var count = el.length;
  equal(n, count, "found it " + count + " times");
});


Ember.Test.registerAsyncHelper('addAttendee', function(app, name, context) {
  Ember.run(function() {
    fillIn(".attendee-name", name);
    click("button.create");
  });
});

App.injectTestHelpers();

test("i kan pazz", function() {
  ok(true, "Hello Tests!");
});
