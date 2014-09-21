var Sequelize = require('sequelize');

module.exports = function (db, emitter)
{
    return db.define('thread', {
        threadId: {
            field: 'thread_id',
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        creator: {
            type: Sequelize.STRING,
            allowNull: false,
            references: 'user',
            referencesKey: 'email'
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        board: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: 'board',
            referencesKey: 'board_id'
        }
    },{
        tableName: 'thread',
        timestamps: false,
        hooks: {
            afterCreate: function (thread, next)
            {
                emitter.emit('board:' + thread.board + ':thread-added', thread);
                next(null, thread);
            },
            afterUpdate: function (thread, next)
            {
                emitter.emit('thread:' + thread.threadId + ':updated', thread);
                next(null, thread);
            },
            afterDestroy: function (thread, next)
            {
                emitter.emit('thread:' + thread.threadId + ':destroyed', thread);
                next(null, thread);
            }
        }
    });
};
