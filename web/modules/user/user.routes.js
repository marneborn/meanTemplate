(function () {
    "use strict";

    angular.module('appUser')
    .config(function ($routeProvider) {

        $routeProvider
        .when('/user/profile', {
            templateUrl: 'modules/user/profile/profile.view.html',
            controller: 'profileController',
            controllerAs: 'vm'
        })
        .when('/user/signin', {
            templateUrl: 'modules/user/signin/signin.view.html',
            controller: 'signinController',
            controllerAs: 'vm'
        })
        .when('/user/signup', {
            templateUrl: 'modules/user/signup/signup.view.html',
            controller: 'signupController',
            controllerAs: 'vm'
        });
    });

})();
