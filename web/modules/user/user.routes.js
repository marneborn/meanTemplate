angular.module('appUser')
.config(function ($routeProvider) {
    $routeProvider
    .when('/tmp', {
        templateUrl: 'modules/user/user.view.html',
        controller: 'userController'
    })
    .when('/login', {
        templateUrl: 'modules/user/login.view.html',
        controller: 'loginController'
    })
    .when('/signin', {
        templateUrl: 'modules/user/signin.view.html',
        controller: 'signinCtrl'
    });
});
