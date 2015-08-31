(function () {
    "use strict";

    angular.module('appUser')
    .provider("user", UserProvider);

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
                    info       : getInfo
                };

                /*
                 *
                 */
                function signup (info) {
			        initUser();

			        return $http
			        .post('user/signup', info, { cache : false })
			        .success(function(data) {
                        mergeUser(data);
                        thisUser.isLoggedIn = true;
			        })
			        .error(function(data, status) {
				        console.error("error - "+status+' - '+angular.toJson(data));
			        });
                }

                /*

                 *
                 */
                function signin (info) {
			        initUser();

                    return $http
                    .post('user/signin', { username : info.username, password : info.password }, { cache : false })
			        .success(function(data) {
                        // FIXME - Do I need to validate here?
                        mergeUser(data);
                        thisUser.isLoggedIn = true;
			        })
			        .error(function(data, status) {
                        console.error("Error logging in");
                        console.error("status> "+JSON.stringify(status));
                        console.error("data> "+JSON.stringify(data));
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
			        .get('user/signout', { cache : false })
			        .success(function() {
			        })
			        .error(function(data, status) {
				        console.error("error - "+status+' - '+angular.toJson(data));
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
                displayName : "",
                email       : "",
                username    : "",
                provider    : "",
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
        function getInfo () {
            return angular.copy(thisUser);
        }
    }
})();
