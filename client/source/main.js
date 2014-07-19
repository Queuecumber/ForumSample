require.config({
        baseUrl: './',
        paths: {
            jquery: '../bower_components/jquery/dist/jquery',
            knockout: '../bower_components/knockout-3.1.0/index',
            requirejs: '../bower_components/',
            domready: '../bower_components/domready/ready',
            bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
            crossroads: '../bower_components/crosroads.js/dist/crossroads.min',
            application: '../bower_components/application/Application'
        },
        shim: {
            'boostrap': {
                deps: ['jquery']
            }
        }
});

require([], function ()
{

});
