var config = require('config');
var socketIO = require('socket.io');
var httpServer = require('http').Server;
var model = require('../model');
var updater = require('redis').createClient(config.redis.port, config.redis.host);


var realtime = {
    start: function (server)
    {
        realtime.io = socketIO.listen(server);

        realtime.io.on('connection', realtime.initiate);

        process.log.info('Realtime communication listening');

        updater.on('message', function (channel, message)
        {
            process.log.info(channel, 'reported upstream change %j', message);

            var room = channel.substring(0, channel.lastIndexOf(':'));
            realtime.io.to(room).emit(channel, message);
        });
    },

    initiate: function (socket)
    {
        process.log.info('New client connected from %s', socket.handshake.address);

        socket.on('join', function (endpoint)
        {
            process.log.info('Client %s reported interest in %s', socket.handshake.address, endpoint);
            socket.join(endpoint);
        });

        socket.on('leave', function (endpoint)
        {
            process.log.info('Client %s no longer interested in %s', socket.handshake.address, endpoint);
            socket.leave(endpoint);
        });

        socket.on('downstream', function (update)
        {
            // Do the actual model update
            // update: { channel: 'thread:145:add-post', data: '{post}' }
            // { channel: thread:145:update, property: title, data: '{title} }

            process.log.info(socket.handshake.address, 'reported downstream change %j', update);

            var channel = update.channel.split(':');

            var collection = channel[0];
            var id = channel[1];
            var event = channel[2];

            realtime.applyDownstream(collection, id, event, update);
        });

        socket.on('disconnect', function ()
        {
            process.log.info('Client %s disconnected', socket.handshake.address);
        });
    },

    applyDownstream: function (collection, id, event, update)
    {
        switch (event)
        {
            case 'update':
                model[collection]
                    .find({ where: { id: id }})
                    .then(function (instance)
                    {
                        process.log.info('Applying downstream update (%s:%d).%s=%s', collection, id, update.property, update.data);

                        instance[update.property] = update.data;
                        instance.save([update.property]);
                    })
                    .catch(function(err)
                    {
                        process.log.error('Error applying downstream update (%s:%d).%s=%s for %s: %s',
                        collection, id, update.property, update.data, socket.handshake.address, err);
                    });
                break;
        }
    }
};

module.exports = realtime;
