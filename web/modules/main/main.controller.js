/**
 * @ngdoc function
 * @name meanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the meanApp
 */
angular.module('meanApp')
.controller('mainCtrl', function ($scope) {
    "use strict";
    $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
});
