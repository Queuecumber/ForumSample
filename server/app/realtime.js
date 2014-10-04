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
            model.board
                .findAll({ where: {parent_board: null}})
                .then(function (instances)
                {
                    process.log.info('Syncing %d instances to %s', instances.length, socket.handshake.address);
                    instances.forEach(function (i)
                    {
                        socket.emit('global:-1:board-added', i.serialize());
                    });
                })
                .catch(function (err)
                {
                    process.log.error('Error syncing %s for %s: %s', channel, socket.handshake.address, err);
                });
        });

        socket.on('downstream', function (update)
        {
            process.log.info(socket.handshake.address, 'reported downstream action ', update);

            var channel = update.channel.split(':');

            var collection = channel[0];
            var id = channel[1];
            var event = channel[2];

            realtime
                .applyDownstream(collection, id, event, update)
                .catch(function(err)
                {
                    process.log.error('Error applying downstream action %j for %s: %s', update, socket.handshake.address, err);
                });
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
                return model[collection]
                    .find({ where: { id: id }})
                    .then(function (instance)
                    {
                        process.log.info('Applying downstream update (%s:%d).%s=%s', collection, id, update.property, update.data);

                        instance[update.property] = update.data;
                        instance.save([update.property]);
                    });
                break;

            case 'board-added':
                process.log.info('Adding board ', update.data);
                return model.board.create({
                    creator: update.data.creator,
                    title: update.data.title,
                    parent_board: update.data.parentBoard
                })
                .then(function ()
                {
                    process.log.info('Successfully added board', update.data);
                });
                break;

            default:
                return Promise.reject(new Error('Unrecognized downstream action'));
        }
    }
};

module.exports = realtime;
