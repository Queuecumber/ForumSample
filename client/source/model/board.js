define(['knockout', 'socketio'], function (ko, io)
{
    var board = function (boardModel)
    {
        this.id = boardModel.id;

        var socket = io();
        socket.emit('join', 'board:' + this.id);

        this.creator = boardModel.creator;

        this.title = ko.observable(boardModel.title).extend({coupling: {
            socket: socket,
            channel: 'board:' + this.id,
            updated: {
                event: ':updated',
                property: 'title'
            }
        }});

        this.boards = ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'board:' + this.id,
            delta: {
                added: ':board-added',
                removed: ':board-removed'
            }
        }});

        this.threads = ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'board:' + this.id,
            delta: {
                added: ':thread-added',
                removed: ':thread-removed'
            }
        }});

        this.sync = function ()
        {
            socket.emit('sync', 'board:' + this.id);
        };

        this.serialize = function ()
        {
            var pure = ko.toJS(this);
            delete pure.posts;
            delete pure.threads;

            return pure;
        };

        this.dispose = function ()
        {
            socket.emit('leave', 'board:' + this.id);

            this.title.dispose();
            this.boards.dispose();
            this.threads.dispose();

            socket.disconnect();
        };

        this.toString = function ()
        {
            return this.title();
        };

        this.equals = function (other)
        {
            return this.id === other.id;
        };
    };

    return board;
});
