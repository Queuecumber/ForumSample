define(['knockout', 'socketio', 'board'], function (ko, io, Board)
{
    var model = function ()
    {
        this.id = null;

        var socket = io();
        socket.emit('join', 'board:null');

        this.boards = ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'board:null',
            modeler: Board,
            delta: {
                added: ':board-added',
                removed: ':board-removed'
            }
        }});

        this.threads = ko.observableArray([]);

        this.sync = function ()
        {
            socket.emit('sync', 'board:null');
        };

        this.dispose = function ()
        {
            socket.emit('leave', 'board:null');

            this.boards.dispose();

            socket.disconnect();
        };
    };

    return model;
});
