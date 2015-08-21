(function () {
    "use strict";

    angular.module('appUser')
    .config(function ($routeProvider) {

        $routeProvider
        .when('/user', {
            templateUrl: 'modules/user/views/user.view.html',
            controller: 'userController',
            controllerAs: 'vm'
        })
        .when('/user/signin', {
            templateUrl: 'modules/user/views/signin.view.html',
            controller: 'signinController',
            controllerAs: 'vm'
        })
        .when('/user/signup', {
            templateUrl: 'modules/user/views/signup.view.html',
            controller: 'signupController',
            controllerAs: 'vm'
        });
    });

})();
