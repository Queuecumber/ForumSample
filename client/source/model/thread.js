define(['knockout', 'socketio'], function (ko, io)
{
    var thread = function (threadModel)
    {
        // id
        this.id = threadModel.id;

        // Inform the server that we are interested in events on this object
        var socket = io();
        socket.emit('join', 'thread:' + this.id);

        // Data fields
        this.creator = threadModel.user;

        this.title = ko.observable(threadModel.title).extend({coupling: {
            socket: socket,
            channel: 'thread:' + this.id,
            updated: {
                event: ':updated',
                property: 'title'
            }
        }});

        this.posts = ko.observableArray([]).extend({coupling: {
            socket: socket,
            channel: 'thread:' this.id,
            delta: {
                added: ':post-added',
                removed: ':post-removed'
            }
        }});

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
    };

    return thread;
});
