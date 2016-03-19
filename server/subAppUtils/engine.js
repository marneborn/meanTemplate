"use strict";

// FIXME - There can probably be one common constructor for this for all pages

const path          = require('path'),
      _             = require('lodash'),
      consolidate   = require('consolidate'),
      globule       = require('globule'),
      L             = require('../logger')('subAppUtils:engine'),
      createLocals  = require('./createLocals'),
      componentDir  = 'web/components';

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
