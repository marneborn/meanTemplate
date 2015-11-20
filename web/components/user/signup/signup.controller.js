(function () {
    "use strict";

    var moduleName = 'commonUser';

    window.registerModule(moduleName)
    .controller('signupController', SignupController);

    function SignupController ($http, $location, user) {

        var vm = this;

        vm.error = "";

	    vm.signup = signup;
        vm.credentials = {
            username : "",
            email    : "",
            password : ""
        };

        function signup () {

            vm.dataLoading = true;
            vm.error = "";

            user.signup({
                username: vm.username,
                email: vm.email,
                password: vm.password
            })
            .then(function () {
			    $location.path('/');
            })
            .catch(function (err) {
                vm.error = err;
            })
            .finally(function () {
                vm.dataLoading = false;
            });
	    }
    }
})();
