var route, expectedModel;

module("Unit: Index Route", {
  setup: function() {
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
  
  expectedModel = [
    { name: "Tyler" }
  ];

  var stub = sinon.stub(App.Attendee, "find")
                  .returns(expectedModel);

  equal(route.model(), expectedModel, 'model is correct');
  ok(stub.called);
}));
