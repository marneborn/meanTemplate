"use strict";

const path          = require('path'),
      _             = require('lodash'),
      consolidate   = require('consolidate'),
      globule       = require('globule'),
      L             = require('../logger')('subAppUtils:createLocals'),
      mainConfig    = require('../config'),
      utils         = require('../utils'),
      componentDir  = 'web/components';

let filerevMapping;

try {
    filerevMapping = require('../../filerev-mapping');
}
catch (err) {
    if (err.message === "Cannot find module '../../filerev-mapping'") {
        filerevMapping = {};
    }
    else {
        throw err;
    }
}

module.exports = createLocals;

/*
 *
 */
function createLocals (subConfig) {
    let makeStaticURL = makeMakeStaticURL(subConfig.thisDir),
        locals = {};

    locals.googleAnalytics = true;
    locals.livereload      = false;
    locals.strictDI        = '';

    if (mainConfig.isDev) {
        locals.googleAnalytics = false;
        locals.livereload      = true;
    }

    locals.shimJs    = pickJs  (subConfig.shimJs   ).map(makeStaticURL);
    locals.vendorJs  = pickJs  (subConfig.vendorJs ).map(makeStaticURL);
    locals.vendorCss = pickCss (subConfig.vendorCss).map(makeStaticURL);
    locals.appJs     = pickJs  (subConfig.appJs    ).map(makeStaticURL);
    locals.appCss    = pickSass(subConfig.appCss   ).map(makeStaticURL);

    // in dev and if the appJs files are in the dist area, turn on strict DI
    if (mainConfig.isDev && locals.appJs && locals.appJs.length > 0 && locals.appJs[0].match(/^dist\//)) {
        locals.strictDI = 'ng-strict-di';
    }

    return locals;
}

/**
 * Figure out the relative path to this file
 * @param {String} file - The file, relative to cwd()
 * @return {String} The path that .static can find
 */
function makeMakeStaticURL (thisDir) {
    return function makeStaticURL (file) {

        if (!file || !file.indexOf)
            return file;

        // all apps share one bower_components
        if (file.indexOf('bower_components/') === 0) {
            return '/'+file;
        }

        // common components will be have url that starts with /components
        if (file.indexOf('web/components/') === 0) {
            return '/'+file.substr(4);
        }

        if (file.indexOf('common/') === 0) {
            return '/'+file;
        }

        return path.posix.relative(thisDir, file);
    };
}

/*
 * Create a list of .js files to load
 */
function pickJs (cfg) {
    let reved = useFilereved(cfg.dist);
    if (utils.fileExists(reved)) {
        return [reved];
    }

    if (utils.fileExists(cfg.dist)) {
        return [cfg.dist];
    }

    let ann = cfg.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
    if (utils.fileExists(ann)) {
        return [ann];
    }

    return cfg.src;
}

/*
 * Create a list of .css files to load
 */
function pickCss (cfg) {

    let reved = useFilereved(cfg.dist);
    if (utils.fileExists(reved)) {
        return [reved];
    }

    if (utils.fileExists(cfg.dist)) {
        return [cfg.dist];
    }

    return cfg.src;
}

/*
 * Create a list of .css files to load
 */
function pickSass (cfg) {

    let reved = useFilereved(cfg.dist);
    if (utils.fileExists(reved)) {
        return [reved];
    }

    if (utils.fileExists(cfg.dist)) {
        return [cfg.dist];
    }

    return [cfg.dev];
}

/**
 * Use the filerev mapping
 */
function useFilereved (from) {
    let reved = filerevMapping[from];
    if (utils.fileExists(reved)) {
        return reved;
    }
    return from;
}

/**
 *
 */
function useAnnotated (from) {
    let ann = from.replace(/\.js$/, '.ngAnn.js');
    if (utils.fileExists(ann)) {
        return ann;
    }
    return from;
}
