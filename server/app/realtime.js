var config = require('config');
var SocketIO = require('socket.io');
var httpServer = require('http').Server;
var model = require('../model');
var updater = require('redis').createClient(config.redis.port, config.redis.host);


var realtime = {
    start: function (server)
    {
        var srv = httpServer(server);
        realtime.io = new SocketIO(srv);

        realtime.io.on('connection', realtime.initiate);

        process.log.info('Realtime communication listening');

        updater.on('message', function (channel, message)
        {
            var room = channel.substring(0, channel.lastIndexOf(':'));
            realtime.io.to(room).emit(channel, message);
        });


    },

    initiate: function (socket)
    {
        socket.on('join', function (endpoint)
        {
            socket.join(endpoint);
        });

        socket.on('leave', function (endpoint)
        {
            socket.leave(endpoint);
        });

        socket.on('downstream', function (update)
        {
            // Do the actual model update
            // update: { channel: 'thread:145:add-post', data: '{post}' }
        });

        process.log.info('New client connected');
    }
};

module.exports = realtime;
