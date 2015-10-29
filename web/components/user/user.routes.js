(function () {
    "use strict";

//     angular.module('appUser')
    angular.module(window.APPNAME)
    .config(function ($routeProvider) {

        $routeProvider
        .when('/user/profile', {
            templateUrl: '/user/profile/profile.view.html',
            controller: 'profileController',
            controllerAs: 'profile'
        })
        .when('/user/signin', {
            templateUrl: '/user/signin/signin.view.html',
            controller: 'signinController',
            controllerAs: 'signin'
        })
        .when('/user/signup', {
            templateUrl: '/user/signup/signup.view.html',
            controller: 'signupController',
            controllerAs: 'signup'
        });
    });

})();
