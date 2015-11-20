"use strict";

var _ = require('lodash');

//FIXME - should I create actual errors? that would require create new errors with the same type...

module.exports.parseError = [
    /* jshint ignore:start */
    /* FIXME - want to, eventually, support generic errors like this, but not yet
    {
         name: "generic duplicate",
         error : {
            name: "MongoError",
            errmsg: "E11000 duplicate key error index: mean-template.coll.$beunique_1 dup key: { : \"somevalue\" }",
            op : {
                beunique: "somevalue"
            }
        },
        expected: {
            _type: 'Duplicate',
            values : {
                beunique : "somevalue"
            }
        }
    },
     */
    /* jshint ignore:end */

    {
        name: "users.email duplicate",
        error : {
            name: "MongoError",
            errmsg: "E11000 duplicate key error index: appname.users.$email_1 dup key: { : \"somevalue\" }",
            op: {
                email: "somevalue"
            }
        },
        expected: {
            _type: 'Duplicate',
            values : {
                email : "somevalue"
            }
        }
    },

    {
        name: "users.provider duplicate",
        error : {
            name: "MongoError",
            errmsg: "E11000 duplicate key error index: appname.users.$providers.source_1_providers.lookup_1 dup key: { : \"providername\", : \"uniquename\" }",  // jshint ignore:line
            index: 0,
            op: {
                "providers": [
                    {
                        "source": "providername",
                        "lookup": "uniquename"
                    }
                ]
            }
        },
        expected: {
            _type: 'Duplicate',
            values : {
                source : 'providername',
                lookup : 'uniquename'
            }
        }
    },

    {
        name : "short password",
        error : {
            "errors": {
                "password": {
                    "kind": "user defined",
                    "message": "Password should be at least 6 characters",
                    "name": "ValidatorError",
                    "path": "password",
                    "properties": {
                        "message": "Password should be at least 6 characters",
                        "path": "password",
                        "type": "user defined",
                        "value": "p"
                    },
                    "stack": "",
                    "value": "p"
                }
            },
            "message": "User validation failed",
            "name": "ValidationError",
            "stack": ""
        },
        expected : {
            _type: 'ValidationError',
            errors : {
                password : "Password should be at least 6 characters"
            }

        }
    }

]
// convert err.op to err.getOperation
.map(function (test) {

    if (test.error.op) {
        var op = _.clone(test.error.op);
        test.error.getOperation = function () { return op; };
        delete test.error.op;
    }

    return test;
});
