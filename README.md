# [WIP] assert-transform

Return a promise that asserts that a babel transformation does what you expect.

```js
var assertTransform = require("assert-transform");
var path = require("path");

describe("babel-plugin-emojification", function () {
  it("does what I think it'll do", function () {
    // Yes, you can just return a promise in a mocha test. Cool right!?
    return assertTransform(
      path.join(__dirname, "./emojify/actual.js"),
      path.join(__dirname, "./emojify/expected.js"), BABEL_OPTIONS);
  });
});
```

*Note:* You must pass in the full path to your files. This is just because I'm tired of working on this and haven't made relative paths work. PRs welcome.
