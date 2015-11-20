"use strict";

var memoryDB = require('../../server/memoryDB');

describe("memoryDB", function () {

    describe("Checking initialization", function () {
        it("should be able to connect and disconnect", function (done) {
            memoryDB
            .connect()
            .call('disconnect')
            .catch(function (err) {
                expect(err).toBe(null, 'Should not throw ');
            })
            .finally(function () {
                done(new Error("foo"));
            });
        });
    });

    describe("adding to the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
            .then(done);
        });

        afterEach(function (done) {
            memoryDB.clear()
            .call('disconnect')
            .then(done);
        });

        it("should be able to add an item", function (done) {
            memoryDB.add('foo', { a : 1 })
            .then(function (num) {
                expect(num).toBe(1, 'Number of items');
                done();
            });
        });

        it("should be able to add multiple items", function (done) {
            memoryDB.add('foo', { a : 1 }, { b: 2})
            .then(function (num) {
                expect(num).toBe(2, 'Number of items');
                done();
            });
        });
    });

    describe("fetching from the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
            .call('add', 'foo', { a : 1 })
            .then(done);
        });

        afterEach(function (done) {
            memoryDB.disconnect()
            .call('clear')
            .then(done);
        });

        it("should be able to get an item", function (done) {
            memoryDB.get('foo', {})
            .then(function (items) {
                expect(items[0].a).toEqual(1);
                done();
            });
        });

    });

    describe("updating the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
            .call('add', 'foo', { a : 1 })
            .then(done);
        });

        afterEach(function (done) {
            memoryDB.disconnect()
            .call('clear')
            .then(done);
        });

        it("should be able update an item", function (done) {
            memoryDB.update('foo', {a:1}, {a:2})
            .then(function (num) {
                expect(num).toEqual(1);
                done();
            });
        });

    });
});
