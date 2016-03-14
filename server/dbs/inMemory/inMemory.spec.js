"use strict";

var memoryDB = require('./index');

describe("Testing the inMemory DB store", function () {

    describe("Checking initialization", function () {
        it("should be able to connect and disconnect", function (done) {
            memoryDB
                .connect()
                .call('disconnect')
                .catch(function (err) {
                    expect(err).toBe(null, 'Should not throw ');
                })
                .finally(done, done.fail);
        });
    });

    describe("adding to the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
                .finally(done, done.fail);
        });

        afterEach(function (done) {
            memoryDB.clear()
                .call('disconnect')
                .finally(done, done.fail);
        });

        it("should be able to add an item", function (done) {
            memoryDB.add('foo', { a : 1 })
                .then(function (num) {
                    expect(num).toBe(1, 'Number of items');
                })
                .finally(done, done.fail);
        });

        it("should be able to add multiple items", function (done) {
            memoryDB.add('foo', { a : 1 }, { b: 2})
                .then(function (num) {
                    expect(num).toBe(2, 'Number of items');
                })
                .finally(done, done.fail);
       });
    });

    describe("fetching from the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
                .call('add', 'foo', { a : 1 })
                .finally(done, done.fail);
        });

        afterEach(function (done) {
            memoryDB.disconnect()
                .call('clear')
                .finally(done, done.fail);
       });

        it("should be able to get an item", function (done) {
            memoryDB.get('foo', {})
                .then(function (items) {
                    expect(items[0].a).toEqual(1);
                })
                .finally(done, done.fail);
        });

    });

    describe("updating the DB", function () {

        beforeEach(function (done) {
            memoryDB.connect()
                .call('add', 'foo', { a : 1 })
                .finally(done, done.fail);
        });

        afterEach(function (done) {
            memoryDB.disconnect()
                .call('clear')
                .finally(done, done.fail);
        });

        it("should be able update an item", function (done) {
            memoryDB.update('foo', {a:1}, {a:2})
                .then(function (num) {
                    expect(num).toEqual(1);
                })
                .finally(done, done.fail);
        });

    });
});
