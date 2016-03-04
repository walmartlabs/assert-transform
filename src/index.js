"use strict";

const _ = require("lodash");
const babel = require("babel-core");
const colors = require("colors/safe");
const jsdiff = require("diff");
const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));

const getDiff = function getDiff(obj) {
  return jsdiff.diffTrimmedLines(obj.actual, obj.expected);
};

const generateErrorMessage = function generateError(diff) {
  return diff.map((part) => {
    let color = "grey";
    if (part.added) { color = "green"; }
    if (part.removed) { color = "red"; }

    return colors[color](part.value);
  })
  .reduce((previousValue, currentValue) => {
    previousValue += currentValue;
    return previousValue;
  }, "");
};

// TODO: Allow initial / expected to be Strings
module.exports = function (initial, expected, babelConfig) {
  const config = _.extend({}, babelConfig, {
    filename: initial
  });

  return Promise.props({
    actual: fs.readFileAsync(initial, "utf8")
      .then(_.partialRight(babel.transform, config))
      .then((result) => result.code)
      .then(_.trim),
    expected: fs.readFileAsync(expected, "utf8")
      .then(_.trim)
  })
  .then(getDiff)
  .then((diff) => {
    if (diff.length === 1) {
      return true;
    } else {
      throw new Error(generateErrorMessage(diff));
    }
  });
};
