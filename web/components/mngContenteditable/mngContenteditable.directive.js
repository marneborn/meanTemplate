/**
 *
 */

(function () {
    "use strict";

    window.registerModule('mngContenteditable')
    .directive('mngContenteditable', MngContenteditable);

    MngContenteditable.$inject = ['$q'];
    function MngContenteditable ($q) {
        var bindings = {};

        return {
			restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                if (attrs.mngContenteditableOnfocus) {
                    bindings.focus = true;
                    element.bind('focus', function() {
                        scope.$eval(attrs.mngContenteditableOnfocus);
                    });
                }

                if (attrs.mngContenteditableEditOnDblclick != null) {
                    bindings.blur = true;
                    element.bind('blur', function () {
                        attrs.$set('contenteditable', undefined);
                    });

                    bindings.dblclick = true;
                    element.bind('dblclick', function (ev) {
                        attrs.$set('contenteditable', true);
                        ev.target.focus();
                    });

                }

                bindings.blur = true;
                element.bind('blur', function() {

                    var html = element.html();

                    element.html(html);
                    ctrl.$setViewValue(html);

                    if (attrs.mngContenteditableOnblur) {
                        $q.when( scope.$eval(attrs.mngContenteditableOnblur) )
                        .then(function (newVal) {
                            if (newVal != null) {
                                element.html(newVal);
                                ctrl.$setViewValue(newVal);
                            }
                        });
                    }

                });

                scope.$on('$destroy',function () {
                    var binds = Object.keys(bindings),
                        i;

                    for (i=0; i<binds.length; i++) {
                        element.unbind(binds[i]);
                    }
                });

                ctrl.$render = function() {
                    element.html(ctrl.$viewValue);
                };
            }
        };
    }
})();
