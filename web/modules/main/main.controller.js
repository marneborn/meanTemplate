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

    MainController.$inject = ['$timeout'];
    function MainController ($timeout) {
        var vm = this;
        vm.coverup = true;

        $timeout(function () {
            vm.coverup = false;
        },2000);

        vm.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }
})();
