"use strict";

describe("Testing mongoose/utils.js", function () {

    var mongooseUtils = require("./utils");

    describe("Testing parseError", function () {
        var testNum = 0;
        require('./utils.spec-helper').parseError.forEach(function (test) {
            var thisTestNum = testNum++;
            it("should pass test: "+test.name, function () {
                expect(mongooseUtils.parseError(test.error)).toEqual(test.expected, "test: "+thisTestNum);
            });
            testNum++;
        });
    });

    describe("Testing makeDotFormat", function () {

        it("should simply return a string", function () {
            expect(mongooseUtils.makeDotFormat("foo")).toEqual("foo");
        });

        it("should simply return a one deep object", function () {
            expect(mongooseUtils.makeDotFormat({ a: 1, b: 2})).toEqual({a: 1, b: 2});
        });

        it("should flatten nested objects", function () {
            expect(
                mongooseUtils.makeDotFormat({ a: 1, b: { c: 2, d: 3}})
            )
            .toEqual({a: 1, "b.c": 2, "b.d": 3});
        });

        it("should work with an already flattened object", function () {
            expect(
                mongooseUtils.makeDotFormat({a: 1, "b.c": 2, "b.d": 3})
            )
            .toEqual({a: 1, "b.c": 2, "b.d": 3});
        });

    });
});
