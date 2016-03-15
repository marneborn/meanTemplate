"use strict";

// FIXME - There can probably be one common constructor for this for all pages

const path          = require('path'),
      fs            = require('fs'),
      _             = require('lodash'),
      consolidate   = require('consolidate'),
      globule       = require('globule'),
      L = require('../logger')('subAppUtils:engine'),
      mainConfig    = require('../config'),
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

module.exports = function (app, subConfig) {

    L.debug("Setting up the render engine for: "+subConfig.name);

    let thisDir  = 'web/'+subConfig.name,
        viewsDir = thisDir + '/views',  // relative to the root dir
        partials = findPartials(thisDir, componentDir, viewsDir);

    app.engine('mustache', consolidate.mustache);
    app.set('views', viewsDir);
    app.set('view engine', 'mustache');

    _.merge(app.locals, createLocals(subConfig));

    app.get('/', function (req, res) {
        res.render('index', {
            cache: false,
            user : !req.user ? null : JSON.stringify(req.user.forClient(), null, 4),
            // FIXME - should fix this in consolidate...
            partials: _.cloneDeep(partials)
        });
    });

    return;

    /**
     * Figure out the relative path to this file
     * @param {String} file - The file, relative to cwd()
     * @return {String} The path that .static can find
     */
    function makeStaticURL (file) {

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
    }

    /*
     *
     */
    function createLocals (subConfig) {
        let locals = {};

        locals.googleAnalytics = true;
        locals.livereload      = false;
        locals.strictDI        = '';

        if (mainConfig.isDev) {
            locals.googleAnalytics = false;
            locals.livereload      = true;
        }

        if (mainConfig.build.type === 'ann') {
            locals.strictDI = 'ng-strict-di';
        }

        locals.shimJs    = pickJs (subConfig.shimJs   ).map(makeStaticURL);
        locals.vendorJs  = pickJs (subConfig.vendorJs ).map(makeStaticURL);
        locals.vendorCss = pickCss(subConfig.vendorCss).map(makeStaticURL);
        locals.appJs     = pickJs (subConfig.appJs    ).map(makeStaticURL);
        locals.appCss    = pickCss(subConfig.appCss   ).map(makeStaticURL);

        return locals;
    }

    /*
     * Create a list of .js files to load
     */
    function pickJs (cfg) {

        let reved = useFilereved(cfg.dist);
        if (fileExists(reved)) {
            return [reved];
        }

        if (fileExists(cfg.dist)) {
            return [cfg.dist];
        }

        let ann = cfg.dist.replace(/(\.min)?\.js$/, '.ngAnn.js');
        if (fileExists(ann)) {
            return [ann];
        }

        return cfg.src;
    }

    /*
     * Create a list of .css files to load
     */
    function pickCss (cfg) {

        let reved = useFilereved(cfg.dist);
        if (fileExists(reved)) {
            return [reved];
        }

        if (fileExists(cfg.dist)) {
            return [cfg.dist];
        }

        if (fileExists(cfg.dev)) {
            return [cfg.dev];
        }

        return _.isArray(cfg.src) ? cfg.src : [];
    }
};

function fileExists (file) {
    try {
        if (fs.statSync(file).isFile()) {
            return true;
        }
    }
    catch (err) {}
    return false;
}

/*
 *
 */
function findPartials (thisDir, componentDir, viewsDir) {

    let partials = {};

    globule
    .find(
        thisDir+'/**/*.partial.mustache',
        componentDir+'/**/*.partial.mustache'
    )
    .map(function (file) {
        let name = path.basename(file, '.partial.mustache'),
            ptr = path.relative(viewsDir, file)
            .replace(/\\/g, '/')
            .replace(/\.mustache/, '');
        partials[name] = ptr;
    });

    return partials;
}

/**
 * Use the filerev mapping
 */
function useFilereved (from) {
    let reved = filerevMapping[from];
    if (fileExists(reved)) {
        return reved;
    }
    return from;
}

/**
 *
 */
function useAnnotated (from) {
    let ann = from.replace(/\.js$/, '.ngAnn.js');
    if (fileExists(ann)) {
        return ann;
    }
    return from;
}
