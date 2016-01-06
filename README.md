# [WIP] assert-transform

Return a promise that asserts that a babel transformation does what you expect.

```js
var assertTransform = require("assert-transform");

describe("babel-plugin-emojification", function () {
  it("does what I think it'll do", function () {
    // Yes, you can just return a promise in a mocha test. Cool right!?
    return assertTransform("./emojify/actual.js", "./emojify/expected.js", BABEL_OPTIONS);
  });
});
```
