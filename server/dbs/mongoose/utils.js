"use strict";

module.exports = {
    parseError : parseError,
    makeDotFormat: makeDotFormat
};

var parseFunctions = {
    ValidationError : handleValidationError,
    MongoError : handleMongoError
};

/*
 *
 */
// FIXME - Should be able to parseValidationError more robustly/generically (make a package?)
function parseError (err) {

    if (!err)
        return null;

    if (!parseFunctions[err.name]) {
        return { _type : "Unknown Error", error: err };
    }

    return parseFunctions[err.name](err);
}

/*
 *
 */
function handleValidationError (err) {

    var fields = Object.keys(err.errors),
        obj = {
            _type : err.name,
            errors : {}
        },
        i;

    for (i=0; i<fields.length; i++) {
        obj.errors[fields[i]] = err.errors[fields[i]].message;
    }

    return obj;
}

/*
 *
 */
function handleMongoError (err) {
    var match = err.errmsg.match(/^E11000 duplicate key error index: \S+\.(\S+)\.\$(\S+) dup key:\s*(\.*)/),
        coll, iname, val, op;

    if (!match) {
        return null;
    }


    coll  = match[1];
    iname = match[2];
    val   = match[3];
    op    = err.getOperation();

    if (coll === 'users' && iname === 'email_1') {
        return {
            _type: 'Duplicate',
            values : {
                email : op.email
            }
        };
    }

    else if (coll === 'users' && iname === 'providers.source_1_providers.lookup_1') {
        return {
            _type: 'Duplicate',
            values : {
                source : op.providers[err.index].source,
                lookup : op.providers[err.index].lookup
            }
        };
    }

    else {
        return {
            _type: 'Unkown Duplicate'
        };
    }

}

// FIXME - This probably isn't correct for Arrays... Not sure how it should work...
function makeDotFormat (obj) {
    var flat = {},
        keys = Object.keys(obj),
        tmp, tmpKeys,
        i, j;

    if (typeof obj !== 'object') {
        return obj;
    }

    for (i=0; i<keys.length; i++) {
        if (typeof obj[keys[i]] !== 'object') {
            flat[keys[i]] = obj[keys[i]];
        }
        else {
            tmp = makeDotFormat(obj[keys[i]]);
            tmpKeys = Object.keys(tmp);
            for (j=0; j<tmpKeys.length; j++) {
                flat[keys[i]+"."+tmpKeys[j]] = tmp[tmpKeys[j]];
            }
        }
    }
    return flat;
}
