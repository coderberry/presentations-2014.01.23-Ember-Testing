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

test("contact list appears on root url", function() {
  expect(2);

  visit("/");
  
  andThen(function() {
    shouldHaveElementWithCount("ul li", 3);
    equal(find("ul li:first").text(), "BOB", "BOB is the first contact");
  });
});

test("add contact to list", function() {
  expect(3);

  visit("/");

  addContact("Jason");

  andThen(function() {
    shouldHaveElementWithCount("ul li", 4);
    equal(find("ul li:last").text(), "JASON", "JASON is the last contact");
    equal(find("#name").val(), "", "Form has been reset");
  });
});
