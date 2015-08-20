"use strict";

/**
 * Create a URI to access a mongodb.
 * If there is a username and password add those for authentication.
 * @param db Object containing the details of the db.
 * @param db.host The IP/name of the host
 * @param db.db The name of the db connecting to
 * @param [db.port] The port that the host is listening to
 * @param [db.username] The username to use for authentication
 * @param [db.password] The password to use for authentication
 * @throws An error if either the host or the db aren't given.
 */
module.exports.makeMongoURI = function (db) {
	if (!db.host)
		throw new Error("Need a host to create a mongo URI");

	if (!db.db)
		throw new Error("Need a db to create a mongo URI");

	var str = 'mongodb://';

	if (db.username && db.password)
		str += db.username + ':' + db.password + '@';

	str += db.host;

	if (db.port != null)
		str += ':' + db.port;

	str += '/' + db.db;

	return str;
};
