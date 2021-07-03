var postcss = require("postcss");
var extend = require("lodash/extend");

var DEFAULTS = {
  base: 16,
  globalEnabled: true,
  minPixelValue: 1,
  unitPrecision: 5,
};

var enabledComment = "px-to-em enabled";
var disabledComment = "px-to-em disabled";

function nonForcedNumericRegex(number) {
  // finds pixel values not followed by `/* force */`
  return new RegExp(number + "px(?!\\s*\\/\\*\\s*force\\s*\\*\\/)", "g");
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

module.exports = postcss.plugin("postcss-px-to-em", function (opts) {
  opts = extend({}, DEFAULTS, opts);

  var regex = /([\d\.]+)px(\s*\/\*\s*force\s*\*\/)?/g;

  var convert = function (context) {
    var replaceable = context.match(regex);

    if (replaceable) {
      replaceable.forEach(function (value) {
        var matches = regex.exec(value);
        regex.lastIndex = 0;

        // if the value is not forced to be pixels, let's replace any matching
        if (!matches[2] && matches[1] > opts.minPixelValue) {
          var parsedVal = toFixed(matches[1] / opts.base, opts.unitPrecision);
          context = context.replace(
            nonForcedNumericRegex(matches[1]),
            parsedVal + "em"
          );
        }
      });
    }

    return context;
  };

  return function (css) {
    var isEnabled = false;
    var isDisabled = false;
    css.some(function (i) {
      isEnabled =
        isEnabled || (i.type === "comment" && i.text === enabledComment);
      isDisabled =
        isDisabled || (i.type === "comment" && i.text === disabledComment);

      return i.type !== "comment";
    });

    ((opts.globalEnabled && !isDisabled) ||
      (!opts.globalEnabled && isEnabled)) &&
      css.walkDecls(function (node) {
        if (node.type === "decl") {
          node.value = convert(
            node.raws && node.raws.value ? node.raws.value.raw : node.value
          );
        }
      });
  };
});
