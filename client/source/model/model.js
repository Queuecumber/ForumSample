define(['knockout', 'socketio'], function (ko, io)
{
    var socket = io();

    var model = {
        boards: ko.observableArray([]),

        sync: function ()
        {
            socket.emit('join', 'global:-1');
        }
    };

    return model;
});
