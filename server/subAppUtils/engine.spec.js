"use strict";

const express = require('express');

fdescribe("tmp", function () {

    let subAppConfig,
        utils,
        engine,
        config,
        app;

    beforeEach(function () {
        app    = express();
        engine = require('./engine');
        utils  = require('../utils'),
        config = require('../config'); // FIXME - loading config is slow...
        subAppConfig = defaultConfig();
        config.isDev = true;
    });

    afterEach(function () {
        Object.keys(require.cache)
            .filter(function(key) {
                return !key.match(/[\/\\]node_modules[\/\\]/)
                    || key.match(/Gruntfile.js/)
                    || key.match(/[\/\\]grunt[\/\\]/);
            })
            .forEach(function(key) {
                delete require.cache[key];
            });
    });

    describe("googleAnalytics", function () {
        it("should be off in development", function () {
            config.isDev = true;
            engine(app, subAppConfig);
            expect(app.locals.googleAnalytics).toBe(false);
        });
        it("should be on in production", function () {
            config.isDev = false;
            engine(app, subAppConfig);
            expect(app.locals.googleAnalytics).toBe(true);
        });
    });

    describe("livereload", function () {
        it("should be on in development", function () {
            config.isDev = true;
            engine(app, subAppConfig);
            expect(app.locals.livereload).toBe(true);
        });
        it("should be off in production", function () {
            config.isDev = false;
            engine(app, subAppConfig);
            expect(app.locals.livereload).toBe(false);
        });
    });

    describe("strictDI", function () {
        it("should be off in production", function () {
            config.isDev = false;
            engine(app, subAppConfig);
            expect(app.locals.strictDI).toBe('');
        });
        it("should be set in development, if using built js files", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                'web/dummyapp/dist/js/dummyapp.ngAnn.js'
            ]));
            config.isDev = true;
            engine(app, subAppConfig);
            expect(app.locals.strictDI).toBe('ng-strict-di');
        });
    });

    describe("JS files", function () {
        it("fall through to the original srcs", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists());
            engine(app, subAppConfig);
            expect(app.locals.shimJs).toEqual(["/bower_components/es5-shim/es5-shim.min.js"]);
            expect(app.locals.vendorJs).toEqual(["/bower_components/angular/angular.min.js"]);
            expect(app.locals.appJs).toEqual([
                "/components/setupApp.js",
                "dummyapp.js",
            ]);
        });

        xit("figure out how to check reved...", function () {
            // how to require non-existent filerev-mapping and have it seen in module
        });

        it("use the built file, if there", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                'web/dummyapp/dist/js/shims.js',
                'web/dummyapp/dist/js/vendor.js',
                'web/dummyapp/dist/js/dummyapp.js'
            ]));
            engine(app, subAppConfig);
            expect(app.locals.shimJs).toEqual(["dist/js/shims.js"]);
            expect(app.locals.vendorJs).toEqual(["dist/js/vendor.js"]);
            expect(app.locals.appJs).toEqual(["dist/js/dummyapp.js"]);
        });

        it("use the annotated file, if there", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                'web/dummyapp/dist/js/dummyapp.ngAnn.js'
            ]));
            engine(app, subAppConfig);
            expect(app.locals.appJs).toEqual(["dist/js/dummyapp.ngAnn.js"]);
        });
    });

    describe("CSS files", function () {
        it("fall through to the unminified version", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists());
            engine(app, subAppConfig);
            expect(app.locals.vendorCss).toEqual(["/bower_components/bootstrap-css/css/bootstrap.min.css"]);
            expect(app.locals.appCss).toEqual(["dist/css/dummyapp.css"]);
        });

        xit("figure out how to check reved...", function () {
            // how to require non-existent filerev-mapping and have it seen in module
        });

        it("use the built file, if there", function () {
            spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                "web/dummyapp/dist/css/vendor.css",
                "web/dummyapp/dist/css/dummyapp.min.css"
            ]));
            engine(app, subAppConfig);
            expect(app.locals.vendorCss).toEqual(["dist/css/vendor.css"]);
            expect(app.locals.appCss).toEqual(["dist/css/dummyapp.min.css"]);
        });
    });

    function fakeFileExists (exists) {
        if (!exists) {
            exists = [];
        }
        return function (file) {
            return exists.indexOf(file) >= 0;
        };
    }

    function defaultConfig () {
        return {
            "name": "dummyapp",
            "thisDir": "web/dummyapp",
            "distDir": "web/dummyapp/dist",
            "shimJs": {
                "dist": "web/dummyapp/dist/js/shims.js",
                "src": [
                    "bower_components/es5-shim/es5-shim.min.js",
                ]
            },
            "vendorJs": {
                "dist": "web/dummyapp/dist/js/vendor.js",
                "src": [
                    "bower_components/angular/angular.min.js"
                ]
            },
            "vendorCss": {
                "dist": "web/dummyapp/dist/css/vendor.css",
                "src": [
                    "bower_components/bootstrap-css/css/bootstrap.min.css"
                ]
            },
            "appJs": {
                "dist": "web/dummyapp/dist/js/dummyapp.js",
                "src": [
                    "web/components/setupApp.js",
                    "web/dummyapp/dummyapp.js",
                ]
            },
            "appCss": {
                "dev": "web/dummyapp/dist/css/dummyapp.css",
                "dist": "web/dummyapp/dist/css/dummyapp.min.css",
                "src": "web/dummyapp/dummyapp.scss"
            }
        };
    }
});
