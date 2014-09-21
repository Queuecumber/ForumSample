define(['knockout', 'socketio'], function (ko, io)
{
    var thread = function (threadModel)
    {
        // data
        this.id = threadModel.id;

        this.creator = threadModel.user;

        this.title = ko.observable(threadModel.title);

        this.posts = ko.observableArray([]);

        // server mutations
        var socket = io();
        socket.emit('join', 'thread:' + id);

        socket.on('thread:' + id + ':updated', function (updatedThread)
        {
            this.title(updatedThread.title);
        }.bind(this));

        // client mutations
        this.title.subscribe(function (newTitle)
        {
            socket.emit('downstream', {
                channel: 'thread:' + id + ':updated',
                data: this.serialize()
            });
        }.bind(this));

        // TODO fill in post add/remove mutations

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
            socket.emit('leave', 'thread:' + id);
        };
    };

    return thread;
});
