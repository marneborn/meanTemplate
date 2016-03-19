(function () {
    "use strict";

    window.registerModule('commonUser')
    .config(UserRoutes);

    /*@ngInject*/
    function UserRoutes ($routeProvider) {
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
    }
})();
