(function () {
    'use strict';

    angular.module('meanApp')
    .config(function ($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'modules/main/main.html',
            controller: 'mainController',
            controllerAs: 'vm'
        })
        .when('/about', {
            templateUrl: 'modules/about/about.html',
            controller: 'aboutController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
    });
})();
