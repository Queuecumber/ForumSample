var SocketIO = require('socket.io');
var httpServer = require('http').Server;


var realtime = {
    start: function (server)
    {
        var srv = httpServer(server);
        realtime.io = new SocketIO(srv);

        realtime.io.on('connection', realtime.clientConnected);

        process.log.info('Realtime communication listening');
    },

    clientConnected: function (socket)
    {
        process.log.info('New client connected');
    }
};

module.exports = realtime;
