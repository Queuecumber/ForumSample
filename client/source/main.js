require.config({
        baseUrl: './',
        paths: {
            jquery: 'bower_components/jquery/dist/jquery',
            knockout: 'bower_components/knockout/dist/knockout',
            requirejs: 'bower_components/requirejs/require',
            domready: 'bower_components/domready/ready',
            bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
            crossroads: 'bower_components/crosroads.js/dist/crossroads.min',
            application: 'bower_components/application/application',
            socketio: 'bower_components/socket.io-client/socket.io',
            model: 'model/model',
            thread: 'model/thread',
            post: 'model/post',
            user: 'model/user',
            board: 'model/board',
            remoteCollection: 'remoteCollection'
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

require(['knockout', 'model'], function (application, model)
{
    var m = new model();

    application.model(m);
    application.compose();
});
