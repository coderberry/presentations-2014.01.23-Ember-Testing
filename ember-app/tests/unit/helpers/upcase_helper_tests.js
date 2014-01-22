module("Helpers: upcase");

test('upcase works', function(){
  var view = createView("{{upcase 'something'}}");
  append(view);

  var renderedText = view.$().text();
  equal(renderedText, 'SOMETHING', "Text rendered: " + renderedText);
});
