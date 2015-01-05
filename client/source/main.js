require.config({
        baseUrl: './',
        paths: {
            jquery: 'bower_components/jquery/dist/jquery',
            knockout: 'bower_components/knockout/dist/knockout',
            requirejs: 'bower_components/requirejs/require',
            domReady: 'bower_components/requirejs-domready/domReady',
            text: 'bower_components/requirejs-text/text',
            bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
            crossroads: 'bower_components/crosroads.js/dist/crossroads.min',
            application: 'bower_components/application/application',
            socketio: 'bower_components/socket.io-client/socket.io',
            model: 'model/model',
            thread: 'model/thread',
            post: 'model/post',
            user: 'model/user',
            board: 'model/board',
            remoteCollection: 'remoteCollection',
            componentLoader: 'componentLoader'
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

require(['knockout', 'model', 'componentLoader', 'domReady!'], function (ko, model)
{
    var m = new model();

    var vm = {
        model: m,

        selectedBoard: ko.observable(m)
    }

    ko.applyBindings(vm);
});
