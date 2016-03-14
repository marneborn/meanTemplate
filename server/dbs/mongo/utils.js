"use strict";

module.exports.makeMongoURI = makeMongoURI;

/**
 * Create a URI to access a mongodb.
 * If there is a username and password add those for authentication.
 * @param obj Object containing the details of the db.
 * @param obj.host The IP/name of the host
 * @param obj.db The name of the db connecting to
 * @param [obj.port] The port that the host is listening to
 * @param [obj.username] The username to use for authentication
 * @param [obj.password] The password to use for authentication
 * @throws An error if either the host or the db aren't given.
 */
function makeMongoURI (obj) {
    if (!obj.host)
        throw new Error("Need a host to create a mongo URI");

    if (!obj.db)
        throw new Error("Need a db to create a mongo URI");

    var str = 'mongodb://';

    if (obj.username && obj.password)
        str += obj.username + ':' + obj.password + '@';

    str += obj.host;

    if (obj.port != null)
        str += ':' + obj.port;

    str += '/' + obj.db;

    return str;
}
