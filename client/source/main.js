require.config({
        baseUrl: './',
        paths: {
            jquery: '/bower_components/jquery/dist/jquery',
            knockout: '/bower_components/knockout/dist/knockout',
            requirejs: '/bower_components/requirejs/require',
            bootstrap: '/bower_components/bootstrap/dist/js/bootstrap',
            crossroads: '/bower_components/crossroads.js/dist/crossroads.min',
            signals: '/bower_components/js-signals/dist/signals.min',
            application: '/bower_components/application/application',
            socketio: '/bower_components/socket.io-client/socket.io',
            model: '/model/model',
            thread: '/model/thread',
            post: '/model/post',
            user: '/model/user',
            board: '/model/board',
            remoteCollection: '/remoteCollection',
            routes: '/routes'
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

require(['application', 'model', 'routes'], function (application, model, router)
{
    var m = new model();

    application.model(m);
    application.compose();

    application.loaded.on(function ()
    {
        router.init();
    });
});
