"use strict";
/*
 ==== Handling provider signup ====
 When signinup through a provider, there are several cases that need to be handled.
 Get the email and a unique lookup from the provider.
 Use both to see if the user already exists.
 And then take the appropriate action described by this table
 hasprovider   = There is an entry in the providers list where source=$provider
 matchprovider = There is an entry in the providers list where source=$provider&&lookup!=$id
 hasemail      = There is an email in the returned user
 matchemail    = The email in the returned user matches the email from the provider.

// FIXME - For now, only do the simple part of the corner cases.
//         Later need to add views for the special case handling
 1. !hasprovider !matchprovider !hasemail !matchemail - create new user
 2. !hasprovider !matchprovider  hasemail  matchemail - add provider
 3.  hasprovider !matchprovider  hasemail  matchemail - fail/throw error
       FIXME - maybe later add provider again, allowing multiple accounts from one provider linked to one user
 4.  hasprovider  matchprovider  hasemail !matchemail - return user (no save)
       (handle email diff or assume it's intentional?)
 5.  hasprovider  matchprovider  hasemail  matchemail - return user (no save)

 These cases are impossible (or should be...)
 If there is no provider, it can't match
 !hasprovider  matchprovider !hasemail !matchemail - impossible
 !hasprovider  matchprovider !hasemail  matchemail - impossible
 !hasprovider  matchprovider  hasemail !matchemail - impossible
 !hasprovider  matchprovider  hasemail  matchemail - impossible

 If there is no email, it can't match
 hasprovider !matchprovider !hasemail  matchemail - impossible
 hasprovider  matchprovider !hasemail  matchemail - impossible
 !hasprovider !matchprovider !hasemail  matchemail - impossible

 If there is an existing provider, there must be an email (emails are required).
 hasprovider  matchprovider !hasemail !matchemail - impossible
 hasprovider !matchprovider !hasemail !matchemail - impossible

 If there is no matched provider and no matched email, no user could have been found
 !hasprovider !matchprovider  hasemail !matchemail - impossible
 hasprovider !matchprovider  hasemail !matchemail - impossible
*/

module.exports = {
    createPassportFunction : createPassportFunction
};

function createPassportFunction (User, strategy) {

    var L = require('../../logger')('user:authenticate:'+strategy.name);

    return function(req, accessToken, refreshToken, profile, done) { /* jshint ignore:line */

        // FIXME - handle !!req.user (ie valid session)
        //         yo-mean merges the logged in user with the provider accunt.
        //         this doesn't seem right to me...
        //         maybe a separate "link accounts" call?
        if (req.user)
            req.logout();

        // Set the provider data and include tokens
        var providerData = profile._json,
            findByProvider = {
                providers : {
                    $elemMatch: {
                        source: strategy.name,
                        lookup: providerData.id
                    }
                }
            },
            findByEmail = {
                email : strategy.getEmail(providerData)
            };

        providerData.accessToken  = accessToken;
        providerData.refreshToken = refreshToken;

        User.findOne(
            { $or : [ findByProvider, findByEmail ] },
            function (err, user) {

                if (err) {
                    L.err("Problem getting "+strategy.name+" user: "+err+(err.stack ? "\n"+err.stack : ""));
                    done(err);
                    return;
                }

                var existingProvider,
                    changed = false;

                // README.txt Handling provider signup case #1
                if (!user) {
                    L.debug("Creating new user: "+providerData.displayName);
                    changed = true;
                    user = strategy.createNewUser(providerData, User);
                }

                else {
                    L.debug("Found user: "+user.displayname);

                    existingProvider = user.getProvider(strategy.name);

                    // README.txt Handling provider signup case #2
                    if (!existingProvider) {
                        L.debug("Adding "+strategy.name+" auth to existing user");
                        changed = true;
                        // FIXME - not DRY with creating in {{strategy}}.js
                        user.providers.push({
                            source : strategy.name,
                            lookup : providerData.id,
                            details: providerData
                        });
                    }

                    // README.txt Handling provider signup case #3
                    else if (existingProvider.lookup !== providerData.id) {
                        /* jshint -W101 : line is too long */
                        done(new Error("There is already an different "+strategy.name+" account associated with this user: "+user.email));
                        /* jshint +W101 */
                        return;
                    }

                    // README.txt Handling provider signup case #4 and #5
                    // do nothing.
                    // FIXME - special handling #4 somehow?
                }

                if (changed) {
                    user.save(function(err) {
                         done(err, user);
                    });
                }

                else {
                    done(null, user);
                }

            }
        );
    };
}
