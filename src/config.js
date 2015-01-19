/**
 * require全局配置项
 */
requirejs.config({
    baseUrl: "./",
    paths: {
        react: "lib/react/react",
        jquery: "lib/jquery/dist/jquery",
        backbone: "lib/backbone/backbone",
        underscore: "lib/underscore/underscore",
        "react-bootstrap": "lib/react-bootstrap/react-bootstrap",
        'jquery-cookie':"lib/jquery-cookie/cookie"
    },
    shim: {
        jquery : {
            exports: "$"
        },
        'jquery-cookie': {
            deps: ['jquery']
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        }
    },
    map: {
        "*": {
            css: "lib/require-css/css"
        }
    }
});
