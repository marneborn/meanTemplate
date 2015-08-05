'use strict';

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

function registerModule (moduleName, dependencies) {
    angular.module(moduleName, dependencies || []);
    angular.module(APPNAME).requires.push(moduleName);
}
