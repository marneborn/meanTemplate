'use strict';

/**
 * @ngdoc function
 * @name yoAngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoAngApp
 */
angular.module('yoAngApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
