var Sequelize = require('sequelize');

module.exports = function (db)
{
    return db.define('post', {
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
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false
        },
        thread: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: 'thread',
            referencesKey: 'thread_id'
        }
    },{
        tableName: 'post',
        timestamps: false,
        hooks: {
            afterCreate: function (post, next)
            {
                emitter.publish('thread:' + post.thread + ':post-added', JSON.stringify(post));
                next(null, post);
            },
            afterUpdate: function (post, next)
            {
                emitter.publish('thread:' + post.thread + ':post-edited', JSON.stringify(post));
                next(null, post);
            },
            afterDestroy: function (post, next)
            {
                emitter.publish('thread:' + post.thread + ':post-deleted', JSON.stringify(post));
                next(null, board);
            }
        }
    });
};
