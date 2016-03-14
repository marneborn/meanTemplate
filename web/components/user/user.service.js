
(function () {
    'use strict';

    var moduleName = 'commonUser';
    window.registerModule(moduleName)
    .provider('user', UserProvider);

    function UserProvider () {

        var thisUser = {};
        initUser();

        return {
            init: function (user) {

                if (user) {
                    mergeUser(user);
                    thisUser.isLoggedIn = true;
                }
            },
            $get: function ($http, $q) {

                return {
                    isLoggedIn : isLoggedIn,
                    signup     : signup,
                    signin     : signin,
                    signout    : signout,
                    update     : update,
                    get        : getValue
                };

                /*
                 *
                 */
                function signup (info) {
                    initUser();

                    return $http
                    .post(
                        '/user/signup',
                        info,
                        {
                            cache : false,
                            headers: {
                                accept : 'application/json'
                            }
                        }
                    )
                    .success(function(data) {
                        mergeUser(data);
                        thisUser.isLoggedIn = true;
                    })
                    .error(function(data, status) {
                        console.error('error - '+status+' - '+angular.toJson(data));
                    });
                }

                /*

                 *
                 */
                function signin (username, password) {
                    initUser();

                    return $http
                    .post(
                        '/user/signin',
                        {
                            username : username,
                            password : password
                        },
                        {
                            cache : false,
                            headers: {
                                accept : 'application/json'
                            }
                        }
                    )
                    .success(function(data) {
                        // FIXME - Do I need to validate here?
                        mergeUser(data);
                        thisUser.isLoggedIn = true;
                    })
                    .error(function(data, status) {
                        console.error('Error logging in');
                        console.error('status> '+JSON.stringify(status));
                        console.error('data> '+JSON.stringify(data));
                    })
                    .catch(function (response) {
                        if (response.data)
                            return $q.reject(response.data.message);
                        return response;
                    });
                }

                /*
                 *
                 */
                function signout () {

                    initUser();

                    return $http
                    .get(
                        '/user/signout',
                        {
                            cache : false,
                            headers: {
                                accept : 'application/json'
                            }
                        }
                    )
                    .success(function() {
                    })
                    .error(function(data, status) {
                        console.error('error - '+status+' - '+angular.toJson(data));
                    });
                }

                /*
                 *
                 */
                function update (info) {

                    return $http
                    .post(
                        '/user/update',
                        info,
                        {
                            cache : false,
                            headers: {
                                accept : 'application/json'
                            }
                        }
                    )
                    .success(function(data) {
                        initUser();
                        mergeUser(data);
                    })
                    .error(function(data, status) {
                        console.error('error - '+status+' - '+angular.toJson(data));
                    })
                    .catch(function (err) {
                        return $q.reject(err.data);
                    });
                }
            }
        };

        /*
         *
         */
        function initUser () {
            thisUser = {
                _id         : null,
                email       : '',
                displayname : '',
                roles       : [],
                isLoggedIn  : false
            };
        }

        /*
         *
         */
        function mergeUser (newInfo) {
            angular.extend(thisUser, newInfo);
        }

        /*
         *
         */
        function isLoggedIn () {
            return thisUser.isLoggedIn;
        }

        /*
         *
         */
        function getValue (key) {
            return thisUser[key];
        }
    }
})();
