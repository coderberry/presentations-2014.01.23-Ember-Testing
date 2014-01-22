var expectedResults;

module("Unit - Model - Attendee", {
  setup: function() {
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

test("find returns array of Attendees", function() {
  expect(1);
  
  results = App.Attendee.find();
  equal(results.length, 3, "there are 3 returned attendees");
});
