describe("Testing mongoUtils.js", function () {
    "use strict";

    var mongoUtils = require("../../../server/mongoUtils");

    describe("Testing parseError", function () {
        require('./mongoUtils-tests').parseError.forEach(function (test) {
            it("should pass test: "+test.name, function () {
                expect(mongoUtils.parseError(test.error)).toEqual(test.expected);
            });
        });
    });

});
