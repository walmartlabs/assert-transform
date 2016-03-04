"use strict";

import { trim, partialRight } from "lodash";
import babel from "babel-core";
import colors from "colors/safe";
import jsdiff from "diff";
import Promise from "bluebird";

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
  return Promise.props({
    actual: fs.readFileAsync(initial, "utf8")
      .then(partialRight(babel.transform, babelConfig))
      .then((result) => result.code)
      .then(trim),
    expected: fs.readFileAsync(expected, "utf8")
      .then(trim)
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
