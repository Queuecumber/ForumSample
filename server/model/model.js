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
        process.log.info('Publishing upstream change for channel %s with data', channel, data);

        try
        {
            data = data.serialize();
            return redis.publish(channel, JSON.stringify(data));
        }
        catch(err)
        {
            process.log.error('Caught exception publishng upstream change for channel %s with data %j: %s', channel, data, err);
        }
    }
}

model = {

};

model.user = user(db, emitter);

model.aclPermission = aclPermission(db, emitter);

model.thread = thread(db, emitter);

model.board = board(db, emitter, model.thread);

model.boardAcl = boardAcl(db, emitter);

model.post = post(db, emitter);

module.exports = model;
