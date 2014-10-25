define(['knockout', 'socketio', 'remoteCollection'], function (ko, io, remoteCollection)
{
    var thread = function (threadModel)
    {
        // id
        this.id = threadModel.id;

        // Inform the server that we are interested in events on this object
        var socket = io();
        socket.emit('join', 'thread:' + this.id);

        // Data fields
        this.creator = threadModel.creator;

        this.title = ko.observable(threadModel.title).extend({coupling: {
            socket: socket,
            channel: 'thread:' + this.id,
            updated: {
                event: ':updated',
                property: 'title'
            }
        }});

        this.posts = remoteCollection([], {
            socket: socket,
            channel: 'thread:' + this.id,
            delta: {
                added: ':post-added',
                removed: ':post-removed'
            }
        });

        this.sync = function ()
        {
            socket.emit('sync', 'thread:' + this.id);
        };

        // serialize
        this.serialize = function ()
        {
            var pure = ko.toJS(this);
            delete pure.posts;

            return pure;
        };

        // dispose
        this.dispose = function ()
        {
            // Tell the server we are no longer interested in events on this object
            socket.emit('leave', 'thread:' + this.id);

            this.title.dipose();
            this.posts.dispose();

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

    return thread;
});
