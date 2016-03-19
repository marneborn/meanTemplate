(function () {
    "use strict";

    window.createApp('testapp2', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap'
    ])
        .constant('appConfig', {
            name: 'testApp2'
        });
})();
