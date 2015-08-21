(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name meanApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the meanApp
     */

    angular.module('meanApp')
    .controller('mainController', MainController);

    function MainController () {
        var vm = this;
        vm.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }
})();
