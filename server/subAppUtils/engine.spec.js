"use strict";

const express = require('express'),
      mockRequire = require('../test/mock-require');

describe("subAppUtils/engine", function () {

    let utils,
        engine,
        mockConfig,
        app;

    beforeEach(function () {
        mockConfig = mockRequire('../config/index.js', makeMockConfig());
        mockRequire('../../filerev-mapping.json', makeMockFileRev());
        app    = express();
        utils  = require('../utils');
        engine = require('./engine');
    });

    afterEach(function () {
        mockRequire.stop();
        mockRequire.clearCache();
    });

    describe("app.locals", function () {
        describe("googleAnalytics", function () {
            it("should be off in development", function () {
                mockConfig.isDev = true;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.googleAnalytics).toBe(false);
            });
            it("should be on in production", function () {
                mockConfig.isDev = false;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.googleAnalytics).toBe(true);
            });
        });

        describe("livereload", function () {
            it("should be on in development", function () {
                mockConfig.isDev = true;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.livereload).toBe(true);
            });
            it("should be off in production", function () {
                mockConfig.isDev = false;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.livereload).toBe(false);
            });
        });

        describe("strictDI", function () {
            it("should be off in production", function () {
                mockConfig.isDev = false;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.strictDI).toBe('');
            });
            it("should be set in development, if using built js files", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    'web/dummypage/dist/js/dummypage.ngAnn.js'
                ]));
                mockConfig.isDev = true;
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.strictDI).toBe('ng-strict-di');
            });
        });

        describe("JS files", function () {
            it("fall through to the original srcs", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists());
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.shimJs).toEqual(["/bower_components/es5-shim/es5-shim.min.js"]);
                expect(app.locals.vendorJs).toEqual(["/bower_components/angular/angular.min.js"]);
                expect(app.locals.appJs).toEqual([
                    "/components/setupApp.js",
                    "dummypage.js",
                ]);
            });

            it("should use the reved version, it it exists", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    'web/dummypage/dist/js/shims.1234.js',
                    'web/dummypage/dist/js/vendor.2345.js',
                    'web/dummypage/dist/js/dummypage.3456.js'
                ]));
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.shimJs).toEqual(["dist/js/shims.1234.js"]);
                expect(app.locals.vendorJs).toEqual(["dist/js/vendor.2345.js"]);
                expect(app.locals.appJs).toEqual(["dist/js/dummypage.3456.js"]);
            });

            it("should use the built file, if there", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    'web/dummypage/dist/js/shims.js',
                    'web/dummypage/dist/js/vendor.js',
                    'web/dummypage/dist/js/dummypage.js'
                ]));
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.shimJs).toEqual(["dist/js/shims.js"]);
                expect(app.locals.vendorJs).toEqual(["dist/js/vendor.js"]);
                expect(app.locals.appJs).toEqual(["dist/js/dummypage.js"]);
            });

            it("use the annotated file, if there", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    'web/dummypage/dist/js/dummypage.ngAnn.js'
                ]));
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.appJs).toEqual(["dist/js/dummypage.ngAnn.js"]);
            });
        });

        describe("CSS files", function () {
            it("fall through to the unminified version", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists());
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.vendorCss).toEqual([
                    "/bower_components/bootstrap-css/css/bootstrap.min.css"
                ]);
                expect(app.locals.appCss).toEqual(["dist/css/dummypage.css"]);
            });

            it("should use the reved version, it it exists", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    "web/dummypage/dist/css/vendor.abcd.css",
                    "web/dummypage/dist/css/dummypage.min.bcde.css"
                ]));
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.vendorCss).toEqual(["dist/css/vendor.abcd.css"]);
                expect(app.locals.appCss).toEqual(["dist/css/dummypage.min.bcde.css"]);
            });

            it("use the built file, if there", function () {
                spyOn(utils, 'fileExists').and.callFake(fakeFileExists([
                    "web/dummypage/dist/css/vendor.css",
                    "web/dummypage/dist/css/dummypage.min.css"
                ]));
                engine(app, mockConfig.subApps.dummypage);
                expect(app.locals.vendorCss).toEqual(["dist/css/vendor.css"]);
                expect(app.locals.appCss).toEqual(["dist/css/dummypage.min.css"]);
            });
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

    function makeMockConfig () {
        return {
            "name": "dummyapp",
            isDev: true,
            subApps : {
                list: ['dummypage'],
                default: 'dummypage',
                dummypage: {
                    "name": "dummypage",
                    "thisDir": "web/dummypage",
                    "distDir": "web/dummypage/dist",
                    "shimJs": {
                        "dist": "web/dummypage/dist/js/shims.js",
                        "src": [
                            "bower_components/es5-shim/es5-shim.min.js",
                        ]
                    },
                    "vendorJs": {
                        "dist": "web/dummypage/dist/js/vendor.js",
                        "src": [
                            "bower_components/angular/angular.min.js"
                        ]
                    },
                    "vendorCss": {
                        "dist": "web/dummypage/dist/css/vendor.css",
                        "src": [
                            "bower_components/bootstrap-css/css/bootstrap.min.css"
                        ]
                    },
                    "appJs": {
                        "dist": "web/dummypage/dist/js/dummypage.js",
                        "src": [
                            "web/components/setupApp.js",
                            "web/dummypage/dummypage.js",
                        ]
                    },
                    "appCss": {
                        "dev": "web/dummypage/dist/css/dummypage.css",
                        "dist": "web/dummypage/dist/css/dummypage.min.css",
                        "src": "web/dummypage/dummypage.scss"
                    }
                }
            }
        };
    }

    function makeMockFileRev () {
        return {
            'web/dummypage/dist/js/shims.js' : 'web/dummypage/dist/js/shims.1234.js',
            'web/dummypage/dist/js/vendor.js' : 'web/dummypage/dist/js/vendor.2345.js',
            'web/dummypage/dist/js/dummypage.js' : 'web/dummypage/dist/js/dummypage.3456.js',
            "web/dummypage/dist/css/vendor.css" : "web/dummypage/dist/css/vendor.abcd.css",
            "web/dummypage/dist/css/dummypage.min.css" : "web/dummypage/dist/css/dummypage.min.bcde.css"
         };
    }
});
