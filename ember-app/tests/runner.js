if (window.location.search.indexOf("?test") !== -1) {
  document.write(
    '<div id="qunit"></div>' +
    '<div id="qunit-fixture"></div>' +
    '<div id="ember-testing-container">' +
    '  <div id="ember-testing"></div>' +
    '</div>' +
    '<link rel="stylesheet" href="tests/runner.css">' +
    '<script src="tests/vendor/sinon-1.7.3.js"></script>' +
    '<link rel="stylesheet" href="tests/vendor/qunit-1.12.0.css">' +
    '<script src="tests/vendor/qunit-1.12.0.js"></script>' +
    '<script src="tests/setup.js"></script>' +
    '<script src="tests/unit/models/todo_tests.js"></script>' +
    '<script src="tests/acceptance/todos_tests.js"></script>'
  )
}
