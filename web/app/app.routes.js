angular.module('meanApp')
.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'modules/main/main.html',
        controller: 'mainCtrl'
    })
    .when('/about', {
        templateUrl: 'modules/about/about.html',
        controller: 'aboutCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});
