var config = require('config');
var socketIO = require('socket.io');
var httpServer = require('http').Server;
var model = require('../model');
var updater = require('redis').createClient(config.redis.port, config.redis.host);
var Promise = require('promise');


var realtime = {
    start: function (server)
    {
        realtime.io = socketIO.listen(server);

        realtime.io.on('connection', realtime.initiate);

        process.log.info('Realtime communication listening');

        updater.on('pmessage', function (pattern, channel, message)
        {
            process.log.info(channel, 'reported upstream change', message);

            var room = channel.substring(0, channel.lastIndexOf(':'));

            process.log.info('Informing interested clients in room %s', room);
            realtime.io.to(room).emit(channel, JSON.parse(message));
        });
        updater.psubscribe('*');
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

        socket.on('sync', function (channel)
        {
            process.log.info(socket.handshake.address, 'requested sync for ', channel);

            var channel = realtime.parseChannel(channel);

            model[channel.collection]
                .sync(channel.id)
                .then(function (info)
                {
                    process.log.info('Syncing %d instances to %s', info.instances.length, socket.handshake.address);
                    info.instances.forEach(function (i)
                    {
                        socket.emit(info.event, i.serialize());
                    });
                })
                .catch(function (err)
                {
                    process.log.error('Error syncing %s for %s: %s', channel, socket.handshake.address, err);
                });
        });

        socket.on('downstream', function (action)
        {
            process.log.info(socket.handshake.address, 'reported downstream action ', action);

            var channel = realtime.parseChannel(action.channel);

            realtime
                model[channel.collection][channel.event](channel.id, action.data)
                .then(function ()
                {
                    process.log.info('Successfully applied downstream action %j for %s', action, socket.handshake.address);
                })
                .catch(function(err)
                {
                    process.log.error('Error applying downstream action %j for %s: %s', action, socket.handshake.address, err);
                });
        });

        socket.on('disconnect', function ()
        {
            process.log.info('Client %s disconnected', socket.handshake.address);
        });
    },

    parseChannel: function (channel)
    {
        channel = channel.split(':');

        var collection = channel[0];
        var id = channel[1];
        var event = channel.length > 2 ? channel[2] : null;

        if(id == 'null')
            id = null;

        return {
            collection: collection,
            id: id,
            event: event
        };
    }
};

module.exports = realtime;
