(function () {
    "use strict";

    angular.module('appUser')
    .controller('signinController', SigninController);

    function SigninController ($http, $location, user) {

        var vm = this;

	    vm.signin = signin;
        vm.credentials = {
            username : "",
            password : ""
        };
        // FIXME - this is kind cludgy, make a directive instead
        //         or just deal with executing a check* function for each twice
        vm.formOK      = false;
        vm.usernameOK  = false;
        vm.passwordErr = "";
        vm.checkForm   = checkForm;

        function signin () {

            vm.error = null;
            vm.showError = true;

            user.signin(vm.credentials)
            .then(function () {
                $location.path('/');
            })
            .catch(function (err) {
                vm.error = err;
            });
	    }

        function checkUsername () {
            vm.usernameOK = !!vm.credentials.username;
        }

        function checkPassword () {
            if (!vm.credentials.password)
                vm.passwordErr = "password is required";

            else if (vm.credentials.password.length < 6)
                vm.passwordErr = "password too short";

            else
                vm.passwordErr = "";

        }

        function checkForm () {
            checkUsername();
            checkPassword();
            vm.formOK = vm.usernameOK && !vm.passwordErr;
            return true;
        }

    }
})();
