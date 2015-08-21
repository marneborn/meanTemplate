(function () {
    "use strict";

    angular.module('appUser')
    .controller('signinController', SigninController);

    function SigninController ($http, $location) {

        var vm = this;

	    vm.signin = signin;

        function signin () {
		    $http.post('/user/signin', vm.credentials)
            .success(function(response) {
                console.log(">> "+JSON.stringify(response));
            // 			$scope.authentication.user = response;
			// And redirect to the index page
			    $location.path('/');
		    })
            .error(function(response) {
			    vm.error = response.message;
		    });
	    }
    }
})();
