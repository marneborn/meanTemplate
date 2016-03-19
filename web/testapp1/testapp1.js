(function () {
    "use strict";

    window.createApp('testapp1', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap'
    ])
        .constant('appConfig', {
            name: 'testApp1'
        });
})();
