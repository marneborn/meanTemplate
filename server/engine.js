var path        = require('path'),
    fs          = require('fs'),
    consolidate = require('consolidate'),
    wiredep     = require('wiredep'),
    globule     = require('globule');

module.exports = function (app) {

    var baseDir, wiredepRes;

    app.engine('mustache', consolidate.mustache);
    app.set('views', './web/views');
    app.set('view engine', 'mustache');

    app.locals.livereload = true;
    app.locals.googleAnalytics = false;

    app.locals.shimJs = [
        "bower_components/es5-shim/es5-shim.min.js",
        "bower_components/json3/lib/json3.min.js"
    ];

    baseDir = path.join(__dirname, '..');

    wiredepRes = wiredep();
    app.locals.vendorJs = wiredepRes.js
    .map(function (file) {
        var min = file.replace(/\.js$/, '.min.js');
        if (fs.existsSync(min))
            file = min;
        return path.relative(baseDir, file).replace(/\\/g, '/');
    })
    .filter(function (file) {
        return app.locals.shimJs.indexOf(file) < 0;
    });

    app.locals.vendorCss = wiredepRes.css
    .map(function (file) {
        var min = file.replace(/\.css$/, '.min.css');
        if (fs.existsSync(min))
            file = min;
        return path.relative(baseDir, file).replace(/\\/g, '/');
    });

    app.locals.appCss = [
        "builtCss/main.css"
    ];

    app.locals.appJs = Array.prototype.concat.call(
        ["app/app.js"],
        globule.find('app/**/*.*.js'             , {srcBase: "web"}),
        globule.find('modules/**/*.module.js'    , {srcBase: "web"}),
        globule
        .find('modules/**/*.js', {srcBase: "web"})
        .filter(function (file) {
            return !file.match(/module.js$/);
        })
    );

    app.get('/', function (req, res) {
        res.render('index');
    });

    return;
};
