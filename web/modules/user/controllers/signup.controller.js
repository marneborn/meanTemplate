(function () {
    "use strict";

    angular.module('appUser')
    .controller('signupController', SignupController);

    function SignupController ($http, $location, user) {

        var vm = this;

	    vm.signup = signup;
        vm.error  = ['foo'];

        function signup () {
            user.signup(vm.credentials)
            .then(function () {
			    $location.path('/');
            });
	    }
    }
})();
