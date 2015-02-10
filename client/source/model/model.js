define(['knockout', 'socketio', 'board', 'thread', 'remoteCollection', 'routes'], function (ko, io, Board, Thread, remoteCollection)
{
    var model = function ()
    {
        this.id = null;

        var socket = io();
        socket.emit('join', 'board:null');

        this.boards = remoteCollection([], {
            socket: socket,
            channel: 'board:null',
            modeler: Board,
            delta: {
                added: ':board-added',
                removed: ':board-removed'
            }
        });

        this.threads = remoteCollection([], {
            socket: socket,
            channel: 'board:null',
            modeler: Thread,
            delta: {
                added: ':thread-added',
                removed: ':thread-removed'
            }
        });

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
