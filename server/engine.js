var consolidate = require('consolidate');

module.exports = function (app) {

    app.engine('mustache', consolidate.mustache);
    app.set('views', './web/views');
    app.set('view engine', 'mustache');

    app.locals.livereload = true;

    app.locals.vendorCss = [
        "bower_components/bootstrap/dist/css/bootstrap.css"
    ];
    app.locals.appCss = [
        "builtCss/main.css"
    ];
    app.locals.shimJs = [
        "bower_components/es5-shim/es5-shim.js",
        "bower_components/json3/lib/json3.min.js"
    ];
    app.locals.vendorJs = [
        "bower_components/jquery/dist/jquery.js",
        "bower_components/angular/angular.js",
        "bower_components/json3/lib/json3.js",
        "bower_components/bootstrap/dist/js/bootstrap.js",
        "bower_components/angular-resource/angular-resource.js",
        "bower_components/angular-cookies/angular-cookies.js",
        "bower_components/angular-sanitize/angular-sanitize.js",
        "bower_components/angular-animate/angular-animate.js",
        "bower_components/angular-touch/angular-touch.js",
        "bower_components/angular-route/angular-route.js"
    ];

    app.locals.appJs = [
        "app.js",
        "modules/main/main.js",
        "modules/about/about.js"
    ];

    app.get('/', function (req, res) {
        res.render('index');
    });

    return;
};
