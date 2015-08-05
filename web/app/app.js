'use strict';

window.registerModule = (function () {

    var APPNAME = 'meanApp';

    /**
     * @ngdoc overview
     * @name meanApp
     * @description
     * # meanApp
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
        var module = angular.module(moduleName, dependencies || []);
        angular.module(APPNAME).requires.push(moduleName);
        return module;
    };

})();
