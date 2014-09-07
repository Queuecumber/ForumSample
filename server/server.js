var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var server = express();
var config = require('config');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: config.log.app_name,
    serializer: bunyan.stdSerializers,
    streams: [{
        type: config.log.type,
        path: config.log.path,
        period: config.log.period,
        count: config.log.count,
        level: config.log.level
    }]
});

server.use(cookieParser());
server.use(session({secret: config.app.sessionSecret}));
server.use(express.static(config.app.public));

server.listen(config.app.port);

log.info("Server listening on port " + config.app.port);
