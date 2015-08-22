(function () {
    "use strict";

    angular.module('appUser')
    .controller('signinController', SigninController);

    function SigninController ($http, $location, user) {

        var vm = this;

	    vm.signin = signin;
        vm.error = null;
        vm.showError = true;
        vm.usernameError = null;
        vm.passwordError = null;

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
    }
})();
