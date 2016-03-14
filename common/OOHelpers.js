(function (module, registerModule) {
    "use strict";

    var requireds;

    // FIXME standardize injection...
    if (registerModule) {
        OOHelpersModule.$inject = [
            // 'somemodule'
        ];
        registerModule('OOHelpersModule')
            .factory('OOHelpers', OOHelpersModule);
    } else if (module) {
        requireds = [
            // require('somemodule')
        ];
        module.exports = OOHelpersModule.apply(null, requireds);
    }

    function OOHelpersModule () {

        return {
            addStore: addStore,
            getAndSet: getAndSet,
            getOnly: getOnly,
            complexGet: complexGet
        };

        function addStore (self, storeKey, values) {
            Object.defineProperty(self, storeKey, {
                writable : false,
                value : values,
                enumberable: true
            });
        }

        function getAndSet (storeKey, key, validator) {
            if (validator) {
                return {
                    get : function () { return this[storeKey][key]; },
                    set : function (val) {
                        this[storeKey][key] = validator(val);
                    },
                    enumerable: true
                };
            }
            else {
                return {
                    get : function () { return this[storeKey][key]; },
                    set : function (val) {
                        this[storeKey][key] = val;
                    },
                    enumerable: true
                };
            }
        }

        function getOnly (storeKey, key) {
            return {
                get : function () { return this[storeKey][key]; },
                set : undefined,
                enumerable: true
            };
        }

        function complexGet (fn) {
            return {
                get: fn,
                set: undefined,
                enumerable: true
            };
        }
    }

})(
    /* globals angular */
    /* globals window */
    /* globals module */
    typeof module !== 'undefined' && module.exports ? module : null,
    typeof angular !== 'undefined' ? window.registerModule : null
);
