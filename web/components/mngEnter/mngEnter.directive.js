(function () {
    "use strict";

    window.registerModule('mngEnter')
    .directive('mngEnter', MngEnter);

    MngEnter.$inject = [];
    function MngEnter () {

        return function (scope, element, attributes) {

            element.bind("keydown", function (event) {

                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attributes.mngEnter);
                    });
                    event.preventDefault();
                }
            });

            scope.$destroy(function () {
                element.unbind('keydown');
            });

        };
    }
})();
