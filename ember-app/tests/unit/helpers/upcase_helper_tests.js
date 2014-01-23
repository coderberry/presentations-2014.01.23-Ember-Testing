module("Unit - Helpers", {
  setup: function() {
    App.reset();
  },
  teardown: function() {
  }
});

test("convert to uppercase", function() {
  var view = createView("{{upcase 'something'}}");
  append(view);

  var renderedText = view.$().text();
  equal(renderedText, "SOMETHING", "Text rendered: " + renderedText);
});
