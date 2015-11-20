"use strict";

describe("Testing mongoose/utils.js", function () {

    var mongooseUtils = require("../../../server/mongoose/utils");

    describe("Testing parseError", function () {
        var testNum = 0;
        require('./utils-tests').parseError.forEach(function (test) {
            var thisTestNum = testNum++;
            it("should pass test: "+test.name, function () {
                expect(mongooseUtils.parseError(test.error)).toEqual(test.expected, "test: "+thisTestNum);
            });
            testNum++;
        });
    });

});
