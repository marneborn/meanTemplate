/*
 * Shimming the Number object for IE
 */
(function () {
    "use strict";

    if (typeof Number.isNaN !== 'function') {
        Number.isNaN = function (o) {
            if (typeof o !== 'number') {
                return true;
            }
            return o !== o;
        };
    }

    if (typeof Number.isFinite !== 'function') {

        Number.isFinite = function (n) {
            if (typeof isFinite === 'function') {
                return isFinite(n);
            }
            if (typeof n !== 'number') {
                return false;
            }
            if (n === Number.NaN || n === Number.NEGATIVE_INFINITY || n === Number.POSITIVE_INFINITY) {
                return false;
            }
            return true;
        };
    }
})();
