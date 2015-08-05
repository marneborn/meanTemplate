'use strict';

/**
 * @ngdoc function
 * @name meanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the meanApp
 */
angular.module('meanApp')
  .controller('aboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
