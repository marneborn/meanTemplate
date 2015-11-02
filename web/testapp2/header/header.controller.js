(function () {
    "use strict";

    angular.module(window.APPNAME)
    .controller('headerController', HeaderController);

    HeaderController.$inject = ['$location', 'user'];
    function HeaderController ($location, user) {
        var vm = this;

        // FIXME: remove isLoggedIn and username from here and view
        vm.isLoggedIn = user.isLoggedIn;
        vm.userName   = user.get('username');
        vm.isActive   = isActive;
        vm.doLogout   = logout;

        function logout () {
            return user.signout()
            .catch(function (err) {
                console.error(err);
            });

        }

        function isActive (viewLocation) {
            return viewLocation === $location.path();
        }
    }
})();
