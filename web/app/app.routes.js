(function () {
    "use strict";

    angular.module('meanApp')
    .config(function ($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'modules/main/main.view.html',
            controller: 'mainController',
            controllerAs: 'vm'
        })
        .when('/about', {
            templateUrl: 'modules/about/about.view.html',
            controller: 'aboutController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
    });
})();
