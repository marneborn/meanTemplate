'use strict';

/**
 * @ngdoc function
 * @name yoAngApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the yoAngApp
 */
angular.module('yoAngApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
