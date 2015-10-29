(function () {
    "use strict";

    angular.module(window.APPNAME)
    .config(function ($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'main/main.view.html',
            controller: 'mainController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });
    });
})();
