var Sequelize = require('sequelize');

module.exports = function (db)
{
    return db.define('user', {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: Sequelize.STRING,
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        tableName: 'user',
        timestamps: false
    });
};
