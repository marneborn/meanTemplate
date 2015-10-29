
window.registerModule = (function () {
    "use strict";

    var APPNAME = 'testApp1';

    window.APPNAME = APPNAME;

    /**
     * @ngdoc overview
     * @name thinFilmFabApp
     * @description
     * # thinFilmFabApp
     *
     * Main module of the application.
     */

    angular.module(APPNAME, [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ]);

    return function (moduleName, dependencies) {

        var module;

        if (!dependencies)
            dependencies = [];

        try {
            // If this module has already been create, add dependencies
            module = angular.module(moduleName);

            var hasDeps = angular.module(moduleName).requires;
            for (var i=0; i<dependencies.length; i++) {
                if (hasDeps.indexOf(dependencies[i]) >= 0)
                    continue;
                hasDeps.push(dependencies[i]);
            }

        }
        catch (err) {
            // create a new module
            module = angular.module(moduleName, dependencies);

            angular
            .module(APPNAME)
            .requires.push(moduleName);
        }

        return module;

    };

})();
