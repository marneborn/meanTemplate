(function () {
    "use strict";

    angular.module('appUser')
    .controller('signupController', SignupController);

    function SignupController ($http, $location, user) {

        var vm = this;

	    vm.signup = signup;
        vm.credentials = {
            username : "",
            email    : "",
            password : ""
        };

        // FIXME - this is kind cludgy, make a directive instead
        //         or just deal with executing a check* function for each twice
        vm.formOK     = false;
        vm.emailOK    = false;
        vm.usernameOK = false;
        vm.passwordOK = false;
        vm.checkForm  = checkForm;

        function signup () {
            user.signup(vm.credentials)
            .then(function () {
			    $location.path('/');
            });
	    }

        function checkUsername () {
            vm.usernameOK = !!vm.credentials.username;
        }

        // FIXME - don't simply return a boolean, but a descriptive error to show.
        function checkPassword () {
            vm.passwordOK = false;
            if (!vm.credentials.password)
                return;
            vm.passwordOK = vm.credentials.password.length >= 6;
        }

        function checkEmail () {
            vm.emailOK = false;
            if (!vm.credentials.email)
                return;
            vm.emailOK = !!vm.credentials.email.match(/.+\@.+\..+/);
        }

        function checkForm () {
            checkEmail();
            checkUsername();
            checkPassword();
            vm.formOK = vm.emailOK && vm.usernameOK && vm.passwordOK;
            return true;
        }
    }
})();
