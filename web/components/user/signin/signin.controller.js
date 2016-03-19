(function () {
    "use strict";

    window.registerModule('commonUser')
        .controller('signinController', SigninController);

    /*@ngInject*/
    function SigninController ($location, $timeout, user) {

        var vm = this;

        vm.dataLoading = false;
        vm.error = "";
        vm.username = "";
        vm.password = "";
        vm.signin = signin;

        function signin () {

            vm.dataLoading = true;
            vm.error = "";

            user.signin(vm.username, vm.password)
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
