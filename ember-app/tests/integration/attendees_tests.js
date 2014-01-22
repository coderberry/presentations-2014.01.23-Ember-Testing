var expectedResults;

module("Integration: Attendees", {
  setup: function() {
    Ember.run(function() { App.reset(); });
    expectedResults = [
      { name: 'Amber' },
      { name: 'Mark' },
      { name: 'Adisyn' }
    ];
    ic.ajax.defineFixture('/api/attendees.json', {
      response: expectedResults,
      jqXHR: {},
      textStatus: 'success'
    });
  },
  teardown: function() {
  }
});


var listItemSelector = "ul li";

function listItems() {
  return $(listItemSelector);
}

test("show list of attendees", function() {
  expect(2);

  visit("/");

  andThen(function() {
    shouldHaveElementWithCount(listItemSelector, 3);
    equal(find(listItemSelector + ":first").text(), "AMBER", "first attendee is Eric");
  });
});

test("add an attendee via the form", function() {
  expect(2);

  visit("/");
  //fillIn(".attendee-name", "Derek");
  //click("button.create");
  addAttendee("Derek");

  andThen(function() {
    equal(listItems().length, 4, "4 attendees should exist");
    equal(find(listItemSelector + ":last").text(), "DEREK", "last attendee is Derek");
  });
});
