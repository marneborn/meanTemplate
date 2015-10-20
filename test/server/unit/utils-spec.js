describe("Testing utils methods", function () {
    "use strict";

    var mtUtils = require('../../../server/utils');

    describe("Testing makeMongoURI", function () {

        it("should create a basic url", function () {
            var db = {
                host : 'server.com',
                port : 12345,
                db   : 'somedbname'
            };
            expect(mtUtils.makeMongoURI(db)).toEqual('mongodb://server.com:12345/somedbname');
        });


        it("should create a url with a username and password", function () {
            var db = {
                host : 'server.com',
                port : 12345,
                db   : 'somedbname',
                username: 'auser',
                password: 'pAssWoRd'
            };
            expect(mtUtils.makeMongoURI(db)).toEqual('mongodb://auser:pAssWoRd@server.com:12345/somedbname');
        });

    });

});
