"use strict";

var _lodash = require("lodash");

var _babelCore = require("babel-core");

var _babelCore2 = _interopRequireDefault(_babelCore);

var _safe = require("colors/safe");

var _safe2 = _interopRequireDefault(_safe);

var _diff = require("diff");

var _diff2 = _interopRequireDefault(_diff);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(require("fs"));

var getDiff = function getDiff(obj) {
  return _diff2.default.diffTrimmedLines(obj.actual, obj.expected);
};

var generateErrorMessage = function generateError(diff) {
  return diff.map(function (part) {
    var color = "grey";
    if (part.added) {
      color = "green";
    }
    if (part.removed) {
      color = "red";
    }

    return _safe2.default[color](part.value);
  }).reduce(function (previousValue, currentValue) {
    previousValue += currentValue;
    return previousValue;
  }, "");
};

// TODO: Allow initial / expected to be Strings
module.exports = function (initial, expected, babelConfig) {
  return _bluebird2.default.props({
    actual: fs.readFileAsync(initial, "utf8").then((0, _lodash.partialRight)(_babelCore2.default.transform, babelConfig)).then(function (result) {
      return result.code;
    }).then(_lodash.trim),
    expected: fs.readFileAsync(expected, "utf8").then(_lodash.trim)
  }).then(getDiff).then(function (diff) {
    if (diff.length === 1) {
      return true;
    } else {
      throw new Error(generateErrorMessage(diff));
    }
  });
};