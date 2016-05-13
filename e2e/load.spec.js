"use strict";

const config = require('../server/config');
let baseURL = config.fullHost;

if (baseURL.substr(-1) !== '/') {
    baseURL += '/';
}

describe('Load pages:', function() {

    it('should load testapp1 by default', function() {
        browser.get(baseURL);
        expect(browser.getTitle()).toEqual(config.subApps[config.subApps.default].title);
    });

    config.subApps.list.forEach(function (saName) {
        let saConfig = config.subApps[saName];

        it('Should load '+saConfig.name+' witout errors', function() {
            browser.get(baseURL+saConfig.name);
            expect(browser.getTitle()).toEqual(saConfig.title);
        });
    });

});
