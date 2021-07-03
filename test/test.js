var postcss = require("postcss");
var expect = require("chai").expect;

var plugin = require("../");

var enabledComment = "px-to-em enabled";
var disabledComment = "px-to-em disabled";

var test = function (input, output, opts, done, from) {
  postcss([plugin(opts)])
    .process(input, { from: from })
    .then(function (result) {
      expect(result.css).to.eql(output);
      expect(result.warnings()).to.be.empty;
      done();
    })
    .catch(function (error) {
      done(error);
    });
};

describe("postcss-px-to-em", function () {
  it("include [/aaa/] for aaa.css", function (done) {
    test(
      "a{width: 200px;}",
      "a{width: 12.5em;}",
      { include: [/aaa/] },
      done,
      "aaa.css"
    );
  });
  it("include [/aaa/] for bbb.css", function (done) {
    test(
      "a{width: 200px;}",
      "a{width: 200px;}",
      { include: [/aaa/] },
      done,
      "bbb.css"
    );
  });

  it("exclude [/aaa/] for aaa.css", function (done) {
    test(
      "a{width: 200px;}",
      "a{width: 200px;}",
      { exclude: [/aaa/] },
      done,
      "aaa.css"
    );
  });

  it("exclude [/aaa/] for bbb.css", function (done) {
    test(
      "a{width: 200px;}",
      "a{width: 12.5em;}",
      { exclude: [/aaa/] },
      done,
      "bbb.css"
    );
  });

  it("unitPrecision = 2", function (done) {
    test(
      "a{width: 2px;}",
      "a{width: 0.13em;}",
      { unitPrecision: 2, base: 16 },
      done
    );
  });

  it("px <= minPixelValue", function (done) {
    test(
      "a{width: 2px;}",
      "a{width: 2px;}",
      { minPixelValue: 2, base: 10 },
      done
    );
  });

  it("enabled is at file header", function (done) {
    test(
      "/* " + enabledComment + " */" + "a{width: 200px;}",
      "/* " + enabledComment + " */" + "a{width: 12.5em;}",
      { globalEnabled: false },
      done
    );
  });

  it("enabled isnot at file header", function (done) {
    test(
      "a{width: 200px;}" + "/*" + enabledComment + "*/",
      "a{width: 200px;}" + "/*" + enabledComment + "*/",
      { globalEnabled: false },
      done
    );
  });

  it("disabled is at file header", function (done) {
    test(
      "/*" + disabledComment + "*/" + "a{width: 200px;}",
      "/*" + disabledComment + "*/" + "a{width: 200px;}",
      {},
      done
    );
  });
  it("disabled isnot at file header", function (done) {
    test(
      "a{width: 200px;}" + "/*" + disabledComment + "*/",
      "a{width: 12.5em;}" + "/*" + disabledComment + "*/",
      {},
      done
    );
  });

  it("replaces pixel values", function (done) {
    test("a{width: 200px;}", "a{width: 12.5em;}", {}, done);
  });

  it("ignores non-decl (like media queries)", function (done) {
    test(
      "@media (max-width: 100px) {}",
      "@media (max-width: 100px) {}",
      {},
      done
    );
  });

  it("ignores explicit px values", function (done) {
    test(
      "a{width: 200px /* force */;}",
      "a{width: 200px /* force */;}",
      {},
      done
    );
  });

  it("obeys custom base", function (done) {
    test("a{width: 200px;}", "a{width: 20em;}", { base: 10 }, done);
  });

  it("works with multiple tokens", function (done) {
    test(
      "a{margin: 200px 400px;}",
      "a{margin: 20em 40em;}",
      { base: 10 },
      done
    );
  });

  it("ingnores explicit px values within multiple tokens", function (done) {
    test(
      "a{margin: 200px/*force*/ 400px 200px 100px;}",
      "a{margin: 200px/*force*/ 40em 20em 10em;}",
      { base: 10 },
      done
    );
  });
});
