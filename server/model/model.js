var config = require('config');
var Sequelize = require('sequelize');
var db = new Sequelize(config.database.name, config.database.user, config.database.password, config.database.params);

db.authenticate().complete(function (err)
{
    if(!!err)
    {
        throw err;
    }
    else
    {
        process.log.info('Database connection established');
    }
});

var user = require('./user');
var aclPermission = require('./aclPermission');
var board = require('./board');
var boardAcl = require('./boardAcl');
var thread = require('./thread');
var post = require('./post');

module.exports = {
    user: user(db),

    aclPermission: aclPermission(db),

    board: board(db),

    boardAcl: boardAcl(db),

    thread: thread(db),

    post: post(db)
};
