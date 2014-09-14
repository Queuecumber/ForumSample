var Sequelize = require('sequelize');

module.exports = function (db)
{
    return db.define('aclPermission', {
        level: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        tableName: 'acl_permission',
        timestamps: false
    });
};
