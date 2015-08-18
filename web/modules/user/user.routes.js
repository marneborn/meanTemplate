angular.module('appUser')
.config(function ($routeProvider) {
    "use strict";

    $routeProvider
    .when('/user', {
        templateUrl: 'modules/user/views/user.view.html',
        controller: 'userController'
    })
    .when('/signin', {
        templateUrl: 'modules/user/views/signin.view.html',
        controller: 'signinController'
    })
    .when('/signup', {
        templateUrl: 'modules/user/views/signup.view.html',
        controller: 'signupController'
    });
});
