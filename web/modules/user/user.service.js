(function () {
    "use strict";

    angular.module('appUser')
    .factory('user', UserService);

	function UserService ($http) {
        console.log("Loading user service");
        var thisUser = {};

		initUser();

		return {
			isLoggedIn : isLoggedIn,
            signin     : signin,
            signout    : signout
		};

        /*
         *
         */
		function initUser () {
		    thisUser = {
                _id         : null,
                firstName   : "",
                lastName    : "",
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
        function isLoggedIn () {
            return thisUser.isLoggedIn;
        }

        /*
         *
         */
        function signin (info) {
			initUser();
			return $http
			.post('user/signin', { email : info.email, password : info.password }, { cache : false })
			.success(function(data, status, headers, config) {
                console.log("Logged in: "+data+status+headers+config);
			})
// 			.error(function(data, status, headers, config) {
			.error(function(data, status) {
				console.log("error - "+status+' - '+angular.toJson(data));
			});
        }

        /*
         *
         */
        function signout (info) {
			initUser();
			return $http
			.post('user/signout', { email : info.username }, { cache : false })
			.success(function(data, status, headers, config) {
                console.log("Logged out: "+data+status+headers+config);
			})
			.error(function(data, status) {
				console.log("error - "+status+' - '+angular.toJson(data));
			});
        }

    }
})();

/*
		// Constants for the user only have meaning in the context of the client.
		// Don't need these to be consistent from one session to the next.
		var R = {
			FALSE  : 0,
			ERROR  : 1,
			LOGIN  : 2,
			LOGOUT : 3
		};

		var userObj = {
			R              : R,
			isLoggedIn     : function () { return loggedIn; },
			email          : function () { return email; },
			id             : function () { return _id; },
			getCurrentUser : getCurrentUser,
			create         : create,
			login          : login,
			logout         : logout
		};

		return userObj;

		function create ( info, $scope ) {

			return $http
			.post('user/create', { email : info.email, password : '' }, { cache : false })
			.success(function(data, status, headers, config) {

				initUser();
				_id      = data._id;
				email    = data.email;
				loggedIn = true;

				$rootScope.$broadcast('userUpdate', R.LOGIN);
			})
			.error(function(data, status, headers, config) {
				console.log("error - "+status+' - '+angular.toJson(data));
				initUser();
				$rootScope.$broadcast('userUpdate', R.LOGOUT);
			});
		}

		function login ( info, $scope ) {

			return $http
			.post('user/login', { email : info.email, password : '' }, { cache : false })
			.success(function(data, status, headers, config) {

				initUser();
				_id      = data._id;
				email    = data.email;
				loggedIn = true;

				$rootScope.$broadcast('userUpdate', R.LOGIN);
			})
			.catch( function ( gotback ) {
				console.log("got error: "+angular.toJson(gotback));
				var msg = ( gotback.status === 404 ) ? "No such user" : gotback.data || gotback.statusText;
				return $q.reject(msg);
			});
		}

 		function logout () {
			return $http.get(
				'user/logout',
				{ cache : false }
			)
			.error(function(data, status, headers, config) {
				console.log("trouble logging out: "+status+' - '+angular.toJson(data));
			})
			['finally'](initUser)
			.then( function () {
				$rootScope.$broadcast('userUpdated', R.LOGOUT);
			});
		}

		function setUser ( data ) {
			initUser();
			_id      = data._id;
			email    = data.email != null ? data.email : '';
			loggedIn = true;
		}

		// "borrowed" nodes querystring.parse
		function qs2json (qs, options) {

			if ( qs.substring(0,1) === '?' )
				qs = qs.substring(1);

			var sep = '&';
			var eq  = '=';
			var obj = {};

			if (typeof qs !== 'string' || qs.length === 0) {
				return obj;
			}

			var regexp = /\+/g;
			qs = qs.split(sep);

			var maxKeys = 1000;
			if (options && typeof options.maxKeys === 'number') {
				maxKeys = options.maxKeys;
			}

			var len = qs.length;
			// maxKeys <= 0 means that we should not limit keys count
			if (maxKeys > 0 && len > maxKeys) {
				len = maxKeys;
			}

			for (var i = 0; i < len; ++i) {
				var x = qs[i].replace(regexp, '%20'),
					idx = x.indexOf(eq),
					kstr, vstr, k, v;

				if (idx >= 0) {
					kstr = x.substr(0, idx);
					vstr = x.substr(idx + 1);
				} else {
					kstr = x;
					vstr = '';
				}

				k = decodeURIComponent(kstr);
				v = decodeURIComponent(vstr);

				if (!obj.hasOwnProperty(k)) {
					obj[k] = v;
				} else if (Array.isArray(obj[k])) {
					obj[k].push(v);
				} else {
					obj[k] = [obj[k], v];
				}
			}

			return obj;
		}

		function getCurrentUser () {

			// FIX ME - want to make stuff dependent on this promise...
			// eg don't get config until this is done so only one session gets created
			// working around this on the server by putting config before sessions
			return $http.get(
				'user/current',
				{ cache : false }
			)
			.success(function(data, status, headers, config) {
				if ( status === 200 ) {
					setUser(data);
					$rootScope.$broadcast('userUpdated', R.LOGIN);
				}
				else { // only other thing that should come is 204, check that? does it matter?
					initUser();
					$rootScope.$broadcast('userUpdated', R.ERROR);
				}
			})
			.error(function(data, status, headers, config) {
				console.log("trouble getting session data from server: "+status+' - '+angular.toJson(data));
			});
		}

	}
]);
*/
