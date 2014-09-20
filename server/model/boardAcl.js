var Sequelize = require('sequelize');

module.exports = function (db)
{
    return db.define('boardAcl', {
        user: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            references: 'user',
            referencesKey: 'email'
        },
        board: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: 'board',
            referencesKey: 'board_id'
        },
        permission: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: 'acl_permission',
            referencesKey: 'level'
        }
    },{
        tableName: 'board_acl',
        timestamps: false,
        hooks: {
            afterUpdate: function (boardAcl, next)
            {
                emitter.publish('user:' + boardAcl.user + ':permissions-changed', JSON.stringify(boardAcl));
                next(null, boardAcl);
            }
    });
};
