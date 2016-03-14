/**
 *
 */

(function () {
    "use strict";

    var moduleName = 'mngReverse';

    window.registerModule(moduleName)
    .filter('reverse', MngReverse);

    function MngReverse () {
        return function(items) {
            if (angular.isArray(items)) {
                return items.slice().reverse();
            }
            return items;
        };
    }
})();
