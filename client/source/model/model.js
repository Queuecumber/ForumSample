define(['knockout', 'socketio'], function (ko, io)
{
    var socket = io();

    socket

    var model = {
        boards: ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'global:-1',
            delta: {
                added: ':board-added',
                removed: ':board-removed'
            }
        }}),

        sync: function ()
        {
            socket.emit('join', 'global:-1');
            socket.emit('sync', 'global:-1');
        }
    };

    return model;
});
