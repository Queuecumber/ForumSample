var config = require('config');
var Sequelize = require('sequelize');
var redis = require('redis').createClient(config.redis.port, config.redis.host);
var db = new Sequelize(config.database.name, config.database.user, config.database.password, config.database.params);

db.authenticate().then(function ()
{
    process.log.info('Database connection established');
})
.catch(function (err)
{
    throw err;
});

var user = require('./user');
var aclPermission = require('./aclPermission');
var board = require('./board');
var boardAcl = require('./boardAcl');
var thread = require('./thread');
var post = require('./post');

// Normalize event API
var emitter = {
    emit: function (channel, data)
    {
        return redis.publish(channel, JSON.stringify(data));
    }
}

module.exports = {
    user: user(db, emitter),

    aclPermission: aclPermission(db, emitter),

    board: board(db, emitter),

    boardAcl: boardAcl(db, emitter),

    thread: thread(db, emitter),

    post: post(db, emitter)
};
