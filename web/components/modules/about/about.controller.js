(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name meanApp.controller:AboutCtrl
     * @description
     * # AboutCtrl
     * Controller of the meanApp
     */
    angular.module('meanApp')
    .controller('aboutController', AboutController);

    function AboutController () {
        var vm = this;
        vm.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }
})();
