"use strict";

const fs = require('fs'),
      path = require('path'),
      mockRequire = require('../test/mock-require');

describe("wiredep wrapper", function () {

    let bowerDir = path.resolve(process.cwd(), 'bower_components'),
        cacheFile = './wiredep-cache.json',
        cachePath = path.resolve(__dirname, cacheFile),
        writeSpy, statSpy,
        cachedObj = { source: 'cache' },
        wiredepObj = { source: 'wiredepRes' },
        cacheStat, bowerStat;

    beforeEach(function () {
        cacheStat = null;
        bowerStat = null;

        mockRequire('wiredep.js', function () { return wiredepObj; });
        mockRequire(cacheFile, cachedObj);

        writeSpy = spyOn(fs, 'writeFileSync');

        statSpy = spyOn(fs, 'statSync').and.callFake(function (path) {
            if (path === cachePath && cacheStat) {
                return cacheStat;
            }
            if (path === bowerDir && bowerStat) {
                return bowerStat;
            }
            throw new Error();
        });

    });

    afterEach(function () {
        mockRequire.stop();
        mockRequire.clearCache(path.join(__dirname, 'wiredep.js'));
    });

    it("should refresh the cache if it doesn't exist", function () {
        expect(require('./wiredep.js')).toBe(wiredepObj);
        expect(writeSpy).toHaveBeenCalled();
    });

    it("shouldn't refresh the cache if it's recent and bower hasn't updated", function () {
        cacheStat = { mtime : new Date() };
        bowerStat = { mtime : new Date() };
        cacheStat.mtime.setHours(cacheStat.mtime.getHours()-2);
        bowerStat.mtime.setHours(bowerStat.mtime.getHours()-3);

        expect(require('./wiredep.js')).toBe(cachedObj);
        expect(writeSpy).not.toHaveBeenCalled();
    });

    it("should refresh the cache if it it's more than 1 day old", function () {
        cacheStat = { mtime : new Date() };
        bowerStat = { mtime : new Date() };
        cacheStat.mtime.setDate(cacheStat.mtime.getDate()-1);
        bowerStat.mtime.setDate(bowerStat.mtime.getDate()-7);

        expect(require('./wiredep.js')).toBe(wiredepObj);
        expect(writeSpy).toHaveBeenCalled();
    });

    it("should refresh the cache if bower has been updated since the cache was created", function () {
        cacheStat = { mtime : new Date() };
        bowerStat = { mtime : new Date() };
        cacheStat.mtime.setHours(cacheStat.mtime.getHours()-2);
        bowerStat.mtime.setHours(bowerStat.mtime.getHours()-1);

        expect(require('./wiredep.js')).toBe(wiredepObj);
        expect(writeSpy).toHaveBeenCalled();
    });
});
