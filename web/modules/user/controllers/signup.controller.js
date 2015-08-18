angular.module('appUser')
.controller('signupController', function ($scope, $http, $location) {
    "use strict";

	$scope.signup = function() {
		$http.post('/user/signup', $scope.credentials).success(function(response) {
            console.log(">> "+JSON.stringify(response));
// 			$scope.authentication.user = response;

			// And redirect to the index page
// 			$location.path('/');
		}).error(function(response) {
			$scope.error = response.message;
		});
	};

});
