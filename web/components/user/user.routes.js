(function () {
    "use strict";

    var moduleName = 'commonUser';

    window.registerModule(moduleName)
    .config(function ($routeProvider) {

        $routeProvider
        .when('/user/profile', {
            templateUrl: '/components/user/profile/profile.view.html',
            controller: 'profileController',
            controllerAs: 'profile'
        })
        .when('/user/signin', {
            templateUrl: '/components/user/signin/signin.view.html',
            controller: 'signinController',
            controllerAs: 'signin'
        })
        .when('/user/signup', {
            templateUrl: '/components/user/signup/signup.view.html',
            controller: 'signupController',
            controllerAs: 'signup'
        });
    });

})();
