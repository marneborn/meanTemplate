(function () {
    "use strict";

    window.createApp = function (appName, dependencies) {

        var app = angular.module(appName, dependencies || []);

        window.registerModule = registerModule;

        return app;

        function registerModule (moduleName, dependencies) {

            var module;

            if (!dependencies)
                dependencies = [];

            try {
                // If this module has already been create, add dependencies
                module = angular.module(moduleName);

                var hasDeps = angular.module(moduleName).requires;
                for (var i=0; i<dependencies.length; i++) {
                    if (hasDeps.indexOf(dependencies[i]) >= 0)
                        continue;
                    hasDeps.push(dependencies[i]);
                }

            }
            catch (err) {
                // create a new module
                module = angular.module(moduleName, dependencies);
                app.requires.push(moduleName);
            }

            return module;
        };
    };
})();
