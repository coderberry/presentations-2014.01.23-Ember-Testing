title: Agenda
class: big
build_lists: true

Things we'll cover:

- Setting up Ember App for Testing
- Integration Tests
- Custom Test Helpers
- Testing XMLHttpRequests (XHR)
- Testing Handlebars Helpers
- Testing Routes
- Unit Testing

---

title: Setup
subtitle: Preparing your Ember App for testing
class: segue dark nobackground

---

class: fill nobackground

<img src="images/starter-kit-download.png">

---

title: Setup
subtitle: index.html

<pre class="prettyprint" data-lang="html">
&lt;html&gt;
&lt;body&gt;

  &lt;!-- Handlebars templates go here --&gt;

  &lt;script src=&quot;js/libs/jquery-1.10.2.js&quot;&gt;&lt;/script&gt;
  &lt;script src=&quot;js/libs/handlebars-1.1.2.js&quot;&gt;&lt;/script&gt;
  &lt;script src=&quot;js/libs/ember-1.3.1.js&quot;&gt;&lt;/script&gt;
  &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;

  &lt;!-- to activate the test runner, add the &quot;?test&quot; query string parameter --&gt;
  &lt;script src=&quot;tests/runner.js&quot;&gt;&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</pre>

---

title: Setup
subtitle: tests/runner.js

<pre class="prettyprint" data-lang="javascript">
if (window.location.search.indexOf(&quot;?test&quot;) !== -1) {
  document.write(
    '&lt;div id=&quot;qunit&quot;&gt;&lt;/div&gt;' +
    '&lt;div id=&quot;qunit-fixture&quot;&gt;&lt;/div&gt;' +
    '&lt;div id=&quot;ember-testing-container&quot;&gt;' +
    '  &lt;div id=&quot;ember-testing&quot;&gt;&lt;/div&gt;' +
    '&lt;/div&gt;' +
    '&lt;link rel=&quot;stylesheet&quot; href=&quot;tests/runner.css&quot;&gt;' +
    '&lt;link rel=&quot;stylesheet&quot; href=&quot;tests/vendor/qunit-1.12.0.css&quot;&gt;' +
    '&lt;script src=&quot;tests/vendor/qunit-1.12.0.js&quot;&gt;&lt;/script&gt;' +
    '&lt;script src=&quot;tests/tests.js&quot;&gt;&lt;/script&gt;'
  )
}
</pre>

---

title: Setup
subtitle: tests/tests.js

<pre class="prettyprint" data-lang="javascript">
// in order to see the app running inside the QUnit runner
App.rootElement = '#ember-testing';

// defer readiness of application and set router location to `none`
App.setupForTesting();

// inject test helpers into window's scope
App.injectTestHelpers();
</pre>

---

title: Setup
subtitle: Hello Test!

<pre class="prettyprint" data-lang="javascript">
test("i kan pazz", function() {
  ok(true, "Hello Test!");
});
</pre>

<div style="text-align: center;">
  <img src="images/qunit-hello-tests.png">
</div>

---

title: Integration Tests
subtitle: Testing from the Outside In
class: segue dark nobackground

---

title: Integration Tests
subtitle: What are integration tests?
class: big
build_lists: true

- Test that different parts of the system work together
- Requires the application to be running (in test mode)
- Basically emulates a user and watches for expected results

---

title: Integration Tests
subtitle: Built-in Test Helpers

<div style="text-align: center; margin-top: -20px;">
  <img src="images/test-helpers.png">
</div>

---

title: Integration Tests
subtitle: TDD Time!
content_class: flexbox vcenter

![TDD](images/TDD.jpg)

---

title: Integration Tests
subtitle: TDD Results

<pre class="prettyprint" data-lang="javascript">
var listItemSelector = "ul li";

test("show list of attendees", function() {
  visit("/");

  andThen(function() {
    equal(find(listItemSelector).length, 3, "there are three attendees");
    equal(find(listItemSelector + ":first").html(), "Eric", "first attendee is Eric");
  });
});

...

---

title: Integration Tests
subtitle: TDD Results

<pre class="prettyprint" data-lang="javascript">
...

test("add an attendee via the form", function() {
  expect(2);

  visit("/");
  fillIn(".attendee-name", "Derek");
  click("button.create");

  andThen(function() {
    equal(find(listItemSelector).length, 4, "4 attendees should exist");
    equal(find(listItemSelector + ":last").html(), "Derek", "last attendee is Derek");
  });
});
</pre>

---

title: Integration Tests
subtitle: TDD Results

<pre class="prettyprint" data-lang="html">
&lt;script type=&quot;text/x-handlebars&quot; id=&quot;index&quot;&gt;
  &lt;form {{action &quot;addAttendee&quot; on=&quot;submit&quot;}}&gt;
    {{input type=&quot;text&quot; value=attendeeName class=&quot;attendee-name&quot; placeholder=&quot;Name&quot;}}
    &lt;button type=&quot;submit&quot; class=&quot;create&quot;&gt;Add&lt;/button&gt;
  &lt;/form&gt;

  &lt;ul&gt;
  {{#each item in model}}
    &lt;li&gt;{{item}}&lt;/li&gt;
  {{/each}}
  &lt;/ul&gt;
&lt;/script&gt;
</pre>

---

title: Integration Tests
subtitle: TDD Results

<pre class="prettyprint" data-lang="javascript">
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['Eric', 'Ryan', 'Aaron'];
  }
});

App.IndexController = Ember.ArrayController.extend({
  actions: {
    addAttendee: function() {
      this.pushObject(this.get('attendeeName'));
    }
  }
});
</pre>

---

title: Custom Test Helpers
subtitle: Creating your own test helpers
class: segue dark nobackground

---

title: Custom Test Helpers
subtitle: Ember.Test.registerHelper

Helpers are injected when `App.injectTestHelpers()` is called.

<pre class="prettyprint" data-lang="javascript">
Ember.Test.registerHelper('shouldHaveElementWithCount', 
  function(app, selector, n, context) {
    var el = findWithAssert(selector, context);
    var count = el.length;
    equal(n, count, "found it " + count + " times");
  }
);

// shouldHaveElementWithCount("ul li", 3);
</pre>

---

title: Custom Test Helpers
subtitle: Ember.Test.registerAsyncHelper

Async Helpers will not run until prior async helpers complete.

<pre class="prettyprint" data-lang="javascript">
Ember.Test.<b>registerAsyncHelper</b>('addAttendee',
  function(app, name, context) {
    <b>Ember.run(function() {</b>
      fillIn(".attendee-name", name);
      click("button.create");
    <b>});</b>
  }
);

// addAttendee("Stan");
// addAttendee("Kyle");
</pre>

---

title: Testing XMLHttpRequests
subtitle: Mocking server responses
class: segue dark nobackground

---

title: Testing XMLHttpRequests
subtitle: This works...

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
App.Person = Ember.Object.extend({});
App.Person.reopenClass({
  find: function() {
    var url = "http://addressbook-api.herokuapp.com/contacts";
    return Ember.$.getJSON(url).then(function(data) {
      var people = Em.A([]);
      data.contacts.forEach(function(d) {
        people.pushObject(App.Person.create(d));
      }); 
      return people;
    });
  }
});
</pre>

[http://jsbin.com/OPeVeted/11](http://jsbin.com/OPeVeted/11/edit?html,js,output)

---

title: Testing XMLHttpRequests
subtitle: ... until you want to perform tests
content_class:  vcenter

<div style="text-align: center;">
  <img src="images/must-wrap-ember-run.png">
</div>
<br/>
<pre class="prettyprint" data-lang="javascript">
test("home page shows contacts", function() {
  visit("/");
  andThen(function() {
    equal(find("ul li").length, 3, "three contacts are on the index page");
  });
});
</pre>

[http://jsbin.com/OPeVeted/11](http://jsbin.com/OPeVeted/11/edit?html,js,output)

---

title: Testing XMLHttpRequests
subtitle: Wrap Ember.$.ajax callbacks with Ember.run

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
function ajax(url, options) {
  return new <b>Ember.RSVP.Promise</b>(function(resolve, reject){
    options = options || {};
    options.url = url;

    <b>options.success = function(data) {
      Ember.run(null, resolve, data);
    };

    options.error = function(jqxhr, status, something) {
      Ember.run(null, reject, arguments);
    };</b>

    Ember.$.ajax(options);
  });
}
</pre>

---

title: Testing XMLHttpRequests
subtitle: Wrap Ember.$.ajax callbacks with Ember.run

<iframe data-src="http://jsfiddle.net/cavneb/6mNHy/embedded/" style="margin-top:
-20px; height: 430px;"></iframe>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

ic-ajax is an Ember-friendly jQuery.ajax wrapper

- returns RSVP promises
- makes apps more testable (resolves promises with Ember.run)
- makes testing ajax simpler with fixture support
- success and error callbacks are not supported
- does not resolve three arguments like `$.ajax` (real promises only resolve a single value). `ic.ajax` only resolves the response data from the request, while `ic.ajax.raw` resolves an object with the three "arguments" as keys if you need them.

<footer class="source"><a href="https://npmjs.org/package/ic-ajax">https://npmjs.org/package/ic-ajax</a></footer>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
var ajax = ic.ajax;
App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return ajax('/foo');
  }
}

// if you need access to the jqXHR or textStatus, use raw
ajax.raw('/foo').then(function(result) {
  // result.response
  // result.textStatus
  // result.jqXHR
});
</pre>

<footer class="source"><a href="https://npmjs.org/package/ic-ajax">https://npmjs.org/package/ic-ajax</a></footer>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
ic.ajax.defineFixture('api/v1/courses', {
  response: [{name: 'basket weaving'}],
  jqXHR: {},
  textStatus: 'success'
});

ic.ajax('api/v1/courses').then(function(result) {
  deepEqual(result, ic.ajax.lookupFixture('api/v1/courses').response);
});
</pre>

<footer class="source"><a href="https://npmjs.org/package/ic-ajax">https://npmjs.org/package/ic-ajax</a></footer>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
module("Integration: People", {
    setup: function() {
        ajax.defineFixture(contactsUrl, {
            response: [
                {first: 'Bob'},
                {first: 'Jason'},
                {first: 'Dan'}
            ],
            jqXHR: {},
            textStatus: 'success'
        });
    },
    teardown: function() {}
});
...
</pre>

<footer class="source"><a href="http://jsfiddle.net/cavneb/DvbGp/2/">http://jsfiddle.net/cavneb/DvbGp/2/</a></footer>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
...
test("home page shows contacts", function() {
    visit("/");

    andThen(function() {
        equal(find("ul li").length, 3, "three contacts are on the index page");
        equal(find("ul li:first").text(), "Bob", "first contact should be Bob");
    });
});
</pre>

<footer class="source"><a href="http://jsfiddle.net/cavneb/DvbGp/2/">http://jsfiddle.net/cavneb/DvbGp/2/</a></footer>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<iframe data-src="http://jsfiddle.net/cavneb/DvbGp/2/embedded/" style="margin-top:
-20px; height: 430px;"></iframe>

---

title: Testing Handlebars Helpers
class: segue dark nobackground

---

title: Testing Handlebars Helpers
subtitle: Example

<pre class="prettyprint" data-lang="javascript">
Ember.Handlebars.helper('upcase', function(value) {
  return value.toUpperCase();
});
</pre>

<pre class="prettyprint" data-lang="handlebars">
{{#each person in controller}}
  &lt;li&gt;{{upcase person.name}}&lt;/li&gt;
{{/each}}
</pre>

---

title: Testing Handlebars Helpers
subtitle: What Would Robert Do (WWRD)?

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
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
</pre>

<footer class="source">
  <a href="http://emberjs.jsbin.com/uYEWenaD/1/edit">http://emberjs.jsbin.com/uYEWenaD/1/edit</a>
</footer>

---

title: Testing Handlebars Helpers
subtitle: What Would Robert Do (WWRD)?

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
module("Handlebars Helpers");

test('upcase', function(){
  var view = createView("{{upcase 'something'}}");
  append(view);

  var renderedText = view.$().text();
  equal(renderedText, 'SOMETHING', "Text rendered: " + renderedText);
});
</pre>

<footer class="source">
  <a href="http://emberjs.jsbin.com/uYEWenaD/1/edit">http://emberjs.jsbin.com/uYEWenaD/1/edit</a>
</footer>

---

title: Testing Routes
subtitle: with some sprinkles of sinon.js
class: segue dark nobackground

---

title: Testing Routes

<pre class="prettyprint" data-lang="javascript">
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
</pre>

---

title: Testing Routes
subtitle: 

<pre class="prettyprint" data-lang="javascript">
test("#model", sinon.test(function() {
  expect(1);

  expectedModel = [
    { name: "Tyler" }
  ];

  <b>var stub = sinon.stub(App.Attendee, "find").returns(expectedModel);</b>

  equal(route.model(), expectedModel, "model is correct");
  ok(stub.called, "App.Attendee.find() was called");
}));
</pre>

---

title: Unit Testing
class: segue dark nobackground

---

title: It's coming...
class: fill nobackground

![](images/doc.jpg)

