"use strict";

module.exports.parseError = parseError;

/*
 *
 */
// FIXME - Should be able to parseValidationError more robustly/generically (make a package?)
function parseError (err) {

    if (!err)
        return null;

    var obj,
        fields, op,
        i, match, coll, iname, val;

    if (err.name === 'ValidationError') {

        fields = Object.keys(err.errors);
        obj = {
            _type : err.name,
            errors : {}
        };

        for (i=0; i<fields.length; i++) {
            obj.errors[fields[i]] = err.errors[fields[i]].message;
        }
    }

    else if (err.name === 'MongoError' ) {
        match = err.errmsg.match(/^E11000 duplicate key error index: \S+\.(\S+)\.\$(\S+) dup key:\s*(\.*)/);
        if (match) {
            coll  = match[1];
            iname = match[2];
            val   = match[3];
            op    = err.getOperation();
            if (coll === 'users' && iname === 'email_1') {
                obj = {
                    _type: 'Duplicate',
                    values : {
                        email : op.email
                    }
                };
            }

            else if (coll === 'users' && iname === 'providers.source_1_providers.lookup_1') {
                obj = {
                    _type: 'Duplicate',
                    values : {
                        source : op.providers[err.index].source,
                        lookup : op.providers[err.index].lookup
                    }
                };
            }

            else {
                obj = {
                    _type: 'Unkown Duplicate'
                };
            }
        }
    }

    return obj || { _type : "Unknown Error" };
}
