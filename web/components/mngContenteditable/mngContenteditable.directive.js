/**
 *
 */

(function () {
    "use strict";

    window.registerModule('mngContenteditable')
    .directive('mngContenteditable', MngContenteditable);

    MngContenteditable.$inject = [];
    function MngContenteditable () {
        return {
			restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                element.bind('blur', function() {
                    scope.$apply(function() {
                        ctrl.$setViewValue(element.html());
                    });
                });

                scope.$on('$destroy',function () {
                    element.unbind('blur');
                });

                ctrl.$render = function() {
                    element.html(ctrl.$viewValue);
                };
            }
        };
    }
})();
