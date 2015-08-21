angular.module('appUser')
.controller('signinController', function ($scope, $http, $location) {
    "use strict";

	$scope.signin = function() {
		$http.post('/user/signin', $scope.credentials).success(function(response) {
            console.log("in> "+JSON.stringify(response));
// 			$scope.authentication.user = response;

			// And redirect to the index page
			$location.path('/');
		}).error(function(response) {
			$scope.error = response.message;
		});
	};

});
