module("Unit - Routes - Index", {
  setup: function() {
    App.reset();
    route = App.IndexRoute.create();
  },
  teardown: function() {
    Ember.run(route, 'destroy');
  }
});

test("it exists", function() {
  expect(2);

  ok(route);
  ok(route instanceof Ember.Route);
});

test("#model", sinon.test(function() {
  expect(2);

  var stub,
      expectedModel = [
        { first: "Jon" }
      ];

  stub = sinon.stub(App.Contact, "find").returns(expectedModel);
  
  equal(route.model(), expectedModel, "model is correct");
  ok(stub.called, "App.Attendee.find() was called");
}));
