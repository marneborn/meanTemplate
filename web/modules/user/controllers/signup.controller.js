(function () {
    "use strict";

    angular.module('appUser')
    .controller('signupController', SignupController);

    function SignupController ($http, $location) {

        var vm = this;

	    vm.signup = signup;
        vm.error  = ['foo'];

        function signup () {
		    $http.post('/user/signup', vm.credentials)
            .success(function(response) {
                console.log(""+response);
			    // And redirect to the index page
			    $location.path('/');
		    })
            .error(function(response) {
			    vm.error = response.message;
		    });
	    }
    }
})();
