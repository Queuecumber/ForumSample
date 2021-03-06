var Sequelize = require('sequelize');
var Promise = require('promise');

module.exports = function (db, emitter, threadModel)
{
    return db.define('board', {
        board_id: {
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
        default_permission: {
            field: 'default_permission',
            type: Sequelize.INTEGER,
            references: 'acl_permission',
            referencesKey: 'level'
        },
        parent_board: {
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
                    emitter.emit('board:' + board.parentBoard + ':board-added', board);
                else
                    emitter.emit('board:null:board-added', board);

                next(null, board);
            },
            afterUpdate: function (board, next)
            {
                emitter.emit('board:' + board.boardId + ':updated', board);
                next(null, board);
            },
            afterDestroy: function (board, next)
            {
                emitter.emit('board:' + board.boardId + ':destroyed', board);
                next(null, board);
            }
        },
        instanceMethods: {
            serialize: function ()
            {
                var pure = this.values;

                pure.parentBoard = pure.parent_board;
                pure.id = pure.board_id;
                pure.defaultPermission = pure.default_permission;

                delete pure.parent_board;
                delete pure.board_id;
                delete pure.default_permission;

                return pure;
            }
        },
        classMethods: {
            sync: function (id)
            {
                var subboards = this.findAll({ where: { parent_board: id }});
                var threads = threadModel.findAll({ where: { board: id }});

                return Promise.all([subboards, threads])
                    .then(function (instances)
                    {
                        return [{
                            instances: instances[0],
                            event: 'board:' + id + ':board-added'
                        },{
                            instances: instances[1],
                            event: 'board:' + id + ':thread-added'
                        }];
                    });
            },

            'board-added': function (id, board)
            {
                return this.create({
                    creator: board.creator,
                    title: board.title,
                    parent_board: id
                });
            },

            'thread-added': function (id, thread)
            {
                return threadModel.create({
                    creator: thread.creator,
                    title: thread.title,
                    board: id
                });
            }
        }
    });
};
