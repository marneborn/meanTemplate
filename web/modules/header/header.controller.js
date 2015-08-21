(function () {
    "use strict";

    angular.module('meanApp')
    .controller('HeaderController', HeaderController);

    function HeaderController ($http, $location, $timeout, user) {
        var vm = this;

        vm.isLoggedIn = user.isLoggedIn;
        vm.isActive   = isActive;
        vm.doLogout   = logout; //user.logout;

        function logout () {
            user.signout();
        }

        function isActive (viewLocation) {
            return viewLocation === $location.path();
        }
    }
})();
