(function () {
    "use strict";

    angular.module('testapp2')
    .config(function ($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'main/main.view.html',
            controller: 'mainController',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
    });
})();
