var Sequelize = require('sequelize');

module.exports = function (db, emitter)
{
    return db.define('board', {
        boardId: {
            field: 'board_id',
            autoIncrement: true,
            allowNull: false,
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        creator: {
            allowNull: false,
            type: Sequelize.STRING,
            references: 'user',
            referencesKey: 'email'
        },
        title: Sequelize.STRING,
        defaultPermission: {
            field: 'default_permission',
            type: Sequelize.INTEGER,
            references: 'acl_permission',
            referencesKey: 'level'
        },
        parentBoard: {
            field: 'parent_board',
            type: Sequelize.INTEGER,
            references: 'board',
            referencesKey: 'board_id'
        }
    },{
        tableName: 'board',
        timestamps: false,
        hooks: {
            afterCreate: function (board, next)
            {
                if(board.parentBoard)
                    emitter.publish('board:' + board.parentBoard + ':subboard-added', JSON.stringify(board));
                else
                    emitter.publish(':board-added', JSON.stringify(board));

                next(null, board);
            },
            afterUpdate: function (board, next)
            {
                emitter.publish('board:' + board.boardId + ':updated', JSON.stringify(board));
                next(null, board);
            },
            afterDestroy: function (board, next)
            {
                emitter.publish('board:' + board.boardId + ':destroyed', JSON.stringify(board));
                next(null, board);
            }
        }
    });
};
