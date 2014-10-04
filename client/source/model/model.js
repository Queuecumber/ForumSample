define(['knockout', 'socketio', 'board'], function (ko, io, board)
{
    var model = function ()
    {
        this.id = -1;

        var socket = io();
        socket.emit('join', 'global:-1');

        this.boards = ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'global:-1',
            modeler: board,
            delta: {
                added: ':board-added',
                removed: ':board-removed'
            }
        }});

        this.threads = ko.observableArray([]);

        this.sync = function ()
        {
            socket.emit('sync', 'global:-1');
        };

        this.dispose = function ()
        {
            socket.emit('leave', 'global:-1');

            this.boards.dispose();

            socket.disconnect();
        };
    };

    return model;
});
