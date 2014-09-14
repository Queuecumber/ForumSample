var Sequelize = require('sequelize');

module.exports = function (db)
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
        timestamps: false
    });
};
