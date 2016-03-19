(function () {
    "use strict";

    window.registerModule('commonUser')
        .controller('profileController', ProfileController);

    /* @ngInject */
    function ProfileController ($location, $scope, $timeout, user) {

        var vm = this;

        vm.dataLoading = false;
        vm.success     = "";
        vm.error       = "";
        vm.email       = "";
        vm.displayname = "";
        vm.username    = "";
        vm.password    = "";
        vm.hasLocal    = false;
        vm.otherProviders = [];
        vm.reset       = reset;
        vm.update      = update;
        vm.reset();

        function reset () {

            vm.email       = user.get('email');
            vm.displayname = user.get('displayname');

            var providers = user.get('providers');
            for (var i=0; i<providers.length; i++) {
                if (providers[i].source === 'local') {
                    vm.hasLocal = true;
                    vm.username = providers[i].lookup;
                }
                else {
                    vm.otherProviders.push(providers[i].source);
                }
            }
        }

        function update () {

            var info = {};

            if (vm.displayname !== user.get('displayname')) {
                info.displayname = vm.displayname;
            }

            if (vm.email !== user.get('email')) {
                info.email = vm.email;
            }
            // FIXME - need to handle username
            if (Object.keys(info).length === 0) {
                return;
            }

            vm.dataLoading = true;
            vm.success = '';
            vm.error = '';

            user.update(info)
            .catch(function (errs) {
                vm.error = errs.join(",");
                // FIXME - this should look better
            })
            .finally(function () {
                vm.dataLoading = false;
                vm.success = 'Changes saved';
            });


        }

    }
})();
