
angular.module('meanApp')
.controller('headerCtrl',
    function($scope, $location) {
        'use strict';

        //$scope.user = user;
        $scope.user = {
            isLoggedIn : function () { return false; },
            email : function () { return "email@example.com"; }
        };

        $scope.doLoginModal = function () {
            alert("login");
            $('#loginModal').modal('show');
        };

        $scope.doSignUpModal = function () {
            alert("signup");
            $('#signUpModal').modal('show');
        };

        $scope.doLogout = function () {
            alert("logout");
            return;
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
);
