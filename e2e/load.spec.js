"use strict";

const config = require('../server/config'),
      baseURL = 'http://local.meantemplate.com:8080/';

describe('Load pages:', function() {

    it('should load testapp1 by default', function() {
        browser.get(baseURL);
        expect(browser.getTitle()).toEqual(config.subApps[config.subApps.default].title);
    });

    for (let i=0; i<config.subApps.list; i++) {
        let saName = config.subApps[i];
        let saConfig = config.subApps[saName];

        it('Should load '+saConfig.name+' witout errors', function() {
            browser.get(baseURL+saConfig.name);
            expect(browser.getTitle()).toEqual(saConfig.title);
        });
    }

});
