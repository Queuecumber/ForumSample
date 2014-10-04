require.config({
        baseUrl: './',
        paths: {
            jquery: 'bower_components/jquery/dist/jquery',
            knockout: 'bower_components/knockout-3.1.0/index',
            requirejs: 'bower_components/requirejs/require',
            domready: 'bower_components/domready/ready',
            bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
            crossroads: 'bower_components/crosroads.js/dist/crossroads.min',
            application: 'bower_components/application/application',
            socketio: 'bower_components/socket.io-client/socket.io',
            model: 'model/model',
            current: 'current',
            currentArray: 'currentArray',
            coupling: 'coupling'
        },
        shim: {
            'boostrap': {
                deps: ['jquery']
            },
            'socketio': {
                exports: 'io'
            }
        }
});

require(['current', 'coupling', 'application', 'model'], function (c, cc, application, model)
{
    application.model(model);
    model.sync();
    application.compose();
});
