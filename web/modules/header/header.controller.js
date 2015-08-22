(function () {
    "use strict";

    angular.module('meanApp')
    .controller('HeaderController', HeaderController);

    function HeaderController ($http, $location, $timeout, user) {
        var vm = this;

        // FIXME: remove isLoggedIn and username from here and view
        vm.isLoggedIn = user.isLoggedIn;
        vm.userName   = user.info().username;
        vm.isActive   = isActive;
        vm.doLogout   = logout;

        function logout () {
            user.signout()
            .then(function () {
                $location.path('/');
            })
            .catch(function (err) {
                console.error(err);
            });

        }

        function isActive (viewLocation) {
            return viewLocation === $location.path();
        }
    }
})();
