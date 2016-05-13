"use strict";

afterEach(function () {
    browser.manage().logs().get('browser').then(function(browserLog) {
        browserLog = browserLog.filter(function (msg) {
            return msg.message !== "http://localhost:35729/livereload.js 0:0"
                +" Failed to load resource: net::ERR_CONNECTION_REFUSED";
        });
        expect(browserLog.length).toEqual(
            0,
            "Messages:\n"+browserLog
                .map(function (msg, idx) { return "  "+(idx+1)+ "-"+msg.level+"-"+msg.message; })
                .join("\n")
        );
    });
});
