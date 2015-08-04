'use strict';

/**
 * @ngdoc overview
 * @name meanApp
 * @description
 * # meanApp
 *
 * Main module of the application.
 */
angular
  .module('meanApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'modules/about/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
