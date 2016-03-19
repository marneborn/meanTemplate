(function () {
    "use strict";

    //FIXME - get defaultBase from subApp config somehow.
    var defaultBase = '/testapp1/',
        msie = document.documentMode;

    window.registerModule('headerModule')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$location', '$scope', '$httpParamSerializer', 'appConfig', 'user'];
    /* jshint -W072 */
    function HeaderController ($location, $scope, $httpParamSerializer, appConfig, user) {
        /* jshint +W072 */
        var vm = this,
            basePath = getBasePath(),
            search = $location.search();

        vm.appName      = appConfig.name;
        vm.navCollapsed = true;
        vm.isActive     = isActive;
        vm.makeHref     = makeHref;
        vm.route        = '';
        vm.doLogout     = logout;

        setRoute();
        $scope.$on('$routeChangeStart', setRoute);

        /*
         *
         */
        function logout () {
            vm.navCollapsed = true;
            return user.signout()
                .catch(function (err) {
                    console.error(err);
                });
        }

        /*
         *
         */
        function setRoute () {
            vm.route = $location.path().replace(/^\//,'');
        }

        /*
         *
         */
        function makeHref (base, route) {
            var href, qs;

            base = '/'+base;

            if (base.substr(-1) !== '/') {
                base += '/';
            }

            if (!route) {
                route = '';
            }

            href = ''
            // if changing route for the current base, make it a relative reference.
                + (base === basePath || base === defaultBase && basePath === '/' ? '' : base)
                + '#/' + route;

            if (base === '/equipment/') {
                qs = $httpParamSerializer(search);
                if (qs) {
                    href += '?' + qs;
                }
            }

            return href;
        }

        /*
         *
         */
        function isActive (checkBase, checkRoute) {
            return checkBase === basePath && (checkRoute == null || checkRoute === $location.path())
                ? 'active' : null;
        }

        /*
         * Cribbed from $location...
         */
        function getBasePath () {
            var href = $location.absUrl(),
                urlParsingNode = document.createElement("a");

            if (msie) {
                urlParsingNode.setAttribute("href", href);
                href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute('href', href);

            return urlParsingNode.pathname;
        }
    }
})();
