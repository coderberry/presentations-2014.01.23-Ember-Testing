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
subtitle: Preparing your Ember App for Testing
class: segue dark nobackground

---

class: fill nobackground

<img src="images/starter-kit-download.png">

<aside class="note">
  <section>
    <ul>
      <li>Easiest way to get up and running with tests</li>
      <li>A lot has been done recently with the starter kit</li>
    </ul>
    <b>Download the Ember App Kit after all the slides are through.</b>
  </section>
</aside>
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

  <b>&lt;!-- to activate the test runner, add the &quot;?test&quot; query string parameter --&gt;
  &lt;script src=&quot;tests/runner.js&quot;&gt;&lt;/script&gt;</b>
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

<aside class="note">
  <section>
    <p>This hook defers the readiness of the application, so that you can start the app when your tests are ready to run.</p>
  </section>
</aside>

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

- They are generally used to test important work flows within your application.
- They require the application to be running (in test mode)
- They emulate user interaction and confirms expected results

---

title: Integration Tests
subtitle: Built-in Test Helpers

<div style="text-align: center; margin-top: -20px;">
  <img src="images/test-helpers.png">
</div>

<aside class="note">
  <section>
    <p>The helpers that perform actions use a global promise object and automatically chain onto that promise object if it exists. This allows you write your tests without worrying about async behaviour your helper might trigger.</p>
  </section>
</aside>

---

title: Integration Tests
subtitle: TDD Time!

<div style="text-align: center; margin-top: -60px;">
  <img src="images/redgreenrefactor.png">
</div>

---

title: Integration Tests
subtitle: TDD Results

<article class="smaller" style="margin-top: -40px;">
<pre class="prettyprint" data-lang="javascript">
test("show list of contacts", function() {
  expect(2)

  visit("/");
  andThen(function() {
    shouldHaveElementWithCount("ul li", 3);
    equal(find("ul li:first").text(), "Ryan", "Ryan is the first contact");
  });
});

test("add contact to list", function() {
  expect(3);

  visit("/");
  addContact("Jason");
  andThen(function() {
    shouldHaveElementWithCount("ul li", 4);
    equal(find("ul li:last").text(), "Jason", "Jason is the last contact");
    equal(find("#name").val(), "", "Form has been reset");
  });
});
</pre>
</article>

---

title: Integration Tests
subtitle: TDD Results

<pre class="prettyprint" data-lang="html">
&lt;script type=&quot;text/x-handlebars&quot; id=&quot;index&quot;&gt;
  <b>&lt;form {{action addContact on=&quot;submit&quot;}}&gt;
    {{input type=&quot;text&quot; value=name id=&quot;name&quot; placeholder=&quot;Type Name...&quot;}}
    &lt;button class=&quot;create&quot;&gt;Add Contact&lt;/button&gt;
  &lt;/form&gt;</b>

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
    return ['Ryan', 'Stanley', 'Eric'];
  }
});

App.IndexController = Ember.ArrayController.extend({
  actions: {
    addContact: function() {
      var name = this.get("name");
      this.pushObject(name);
      this.set("name", null);
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
    equal(n, count, "found " + count + " times");
  }
);

// shouldHaveElementWithCount("ul li", 3);
</pre>

---

title: Custom Test Helpers
subtitle: Ember.Test.registerAsyncHelper

Async Helpers will not run until prior async helpers complete.

<pre class="prettyprint" data-lang="javascript">
Ember.Test.<b>registerAsyncHelper</b>('addContact',
  function(app, name, context) {
    fillIn("#name", name);
    click("button.create");
  }
);

// addContact("Dan");
// addContact("Deric");
</pre>

---

title: Testing XMLHttpRequests
subtitle: Mocking server responses
class: segue dark nobackground

---

title: Testing XMLHttpRequests
subtitle: This works...

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
App.Contact = Ember.Object.extend({});
App.Contact.reopenClass({
  find: function() {
    var url = "http://addressbook-api.herokuapp.com/contacts",
        contacts = Em.A([]);

    Ember.$.getJSON(url).then(function(data) {
      data.contacts.forEach(function(c) {
        var contact = App.Contact.create(c);
        contacts.pushObject(contact);
      }.bind(this));
    }.bind(this));

    return contacts;
  }
});
</pre>

---

title: Testing XMLHttpRequests
subtitle: ... until you want to perform tests
content_class:  vcenter

<div style="text-align: center;">
  <img src="images/must-wrap-ember-run.png">
</div>
<br/>
<pre class="prettyprint" data-lang="javascript">
  test("contact list appears on root url", function() {
    expect(2);
    visit("/");
    andThen(function() {
      shouldHaveElementWithCount("ul li", 3);
      equal(find("ul li:first").text(), "Ryan", "Ryan is the first contact");
    });
  });
</pre>

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

<iframe data-src="http://jsfiddle.net/cavneb/6mNHy/2/embedded/" style="margin-top:
-20px; height: 430px;"></iframe>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax
build_lists: true

ic-ajax is an Ember-friendly jQuery.ajax wrapper

- returns RSVP promises
- makes apps more testable (resolves promises with Ember.run)
- makes testing ajax simpler with fixture support

however, there are two exceptions which make it different

- success and error callbacks are not supported
- does not resolve three arguments like `$.ajax` (see next slide)

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
subtitle: ic-ajax - Example Usage

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

<article class="smaller">
<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
module("Integration - Contacts", {
  setup: function() {
    App.reset();
    ajax.defineFixture("http://addressbook-api.herokuapp.com/contacts", {
      response: { 
        contacts: [
          { first: "Bob" },
          { first: "Jason" },
          { first: "Dan" }
        ]
      },
      jqXHR: {},
      textStatus: "success"
    });
  },
  teardown: function() {}
});
...
</pre>
</article>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<pre class="prettyprint" data-lang="javascript" style="margin-top: -20px;">
...
test("contact list appears on root url", function() {
  expect(2);

  visit("/");
  
  andThen(function() {
    shouldHaveElementWithCount("ul li", 3);
    equal(find("ul li:first").text(), "Bob", "Bob is the first contact");
  });
});
</pre>

---

title: Testing XMLHttpRequests
subtitle: ic-ajax

<iframe data-src="http://jsfiddle.net/cavneb/DvbGp/3/embedded/" style="margin-top:
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

<article class="smaller">
<pre class="prettyprint" data-lang="javascript">
var route, expectedModel;

module("Unit: Index Route", {
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
</pre>
</article>

---

title: Testing Routes
subtitle: 

<pre class="prettyprint" data-lang="javascript">
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
</pre>

---

title: Unit Testing
class: segue dark nobackground

---

title: It's coming...
class: fill nobackground

![](images/doc.jpg)

