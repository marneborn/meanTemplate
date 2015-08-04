'use strict';

angular.module('testStore')
.controller('headerCtrl', [
    '$scope',
    '$location',
    'configService',
    'user',
    'items',
    function($scope, $location, configService, user, items) {

        $scope.cart      = items.cart;
        $scope.user      = user;
        $scope.purchased = items.purchased;

        $scope.config    = {
            canLogin: true
        };

        configService.then( function ( config ) {
            $scope.config    = config;
        });

        $scope.doLoginModal = function () {
            $('#loginModal').modal('show');
        };

        $scope.doSignUpModal = function () {
            $('#signUpModal').modal('show');
        };

        $scope.doLogout = function () {
            $scope.userid    = '?';
            user.logout()
            .then(items.handleUserLogout);
        };

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
]);
