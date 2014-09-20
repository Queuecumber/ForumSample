// Set up global config and logging
var config = require('config');
var bunyan = require('bunyan');
var BunyanFormattedOutput = require('bunyan-prettystream');

var formatStdOutLog = new BunyanFormattedOutput();
formatStdOutLog.pipe(process.stdout);


process.log = bunyan.createLogger({
    name: config.log.app_name,
    serializer: bunyan.stdSerializers,
    streams: [{
        stream: formatStdOutLog,
        level: config.log.level
    },{
        type: config.log.type,
        path: config.log.path,
        period: config.log.period,
        count: config.log.count,
        level: config.log.level
    }]
});

// Import libraries
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var server = express();

server.use(cookieParser());
server.use(session({secret: config.app.sessionSecret}));
server.use(express.static(config.app.public));

server.listen(config.app.port);

process.log.info('Server listening on port ' + config.app.port);
