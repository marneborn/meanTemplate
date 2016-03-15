(function () {
    "use strict";

    window.registerModule('commonUser')
        .controller('signupController', SignupController);

    /*@ngInject*/
    function SignupController ($http, $location, user) {

        var vm = this;

        vm.errors = [];

        vm.signup = signup;
        vm.credentials = {
            username : "",
            email    : "",
            password : ""
        };

        function signup () {

            vm.dataLoading = true;
            vm.errors = [];

            user.signup({
                username: vm.username,
                email: vm.email,
                password: vm.password
            })
            .then(function () {
                $location.path('/');
            })
            .catch(function (err) {
                if (err.data._type) {
                    vm.errors = Object.keys(err.data.errors).map(function (key) {
                        return err.data.errors[key];
                    });
                }
                else {
                    vm.errors.push(err.data);
                }
            })
            .finally(function () {
                vm.dataLoading = false;
            });
        }
    }
})();
