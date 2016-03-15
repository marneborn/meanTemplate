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

        if (mainConfig.build.type === 'min' || mainConfig.build.type === 'ann') {
            locals.shimJs     = [ subConfig.shimJs.dist   ].map(useFilereved).map(makeStaticURL);
            locals.vendorJs   = [ subConfig.vendorJs.dist ].map(useFilereved).map(makeStaticURL);
            locals.vendorCss  = [ subConfig.vendorCss.dist].map(useFilereved).map(makeStaticURL);
            locals.appCss     = [ subConfig.appCss.dist].map(useFilereved).map(makeStaticURL);
        }
        else {
            locals.shimJs     = subConfig.shimJs   .src.map(makeStaticURL);
            locals.vendorJs   = subConfig.vendorJs .src.map(makeStaticURL);
            locals.vendorCss  = subConfig.vendorCss.src.map(makeStaticURL);
            locals.appCss     = [ subConfig.appCss.dev ].map(makeStaticURL);
        }

        if (mainConfig.build.type === 'min') {
            locals.appJs      = [ subConfig.appJs.dist ].map(useFilereved).map(makeStaticURL);
        }

        else if (mainConfig.build.type === 'ann') {
            locals.appJs      = [ subConfig.appJs.dist ].map(useAnnotated).map(makeStaticURL);
        }

        else {
            locals.appJs      = subConfig.appJs.src     .map(makeStaticURL);
        }

        return locals;
    }
};

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
    if (reved && fs.statSync(reved).isFile()) {
        return reved;
    }
    return from;
}

/**
 *
 */
function useAnnotated (from) {
    let ann = from.replace(/\.js$/, '.ngAnn.js');
    if (ann && fs.statSync(ann).isFile()) {
        return ann;
    }
    return from;
}
