/*
Created by Umar Tahir
*/

module.exports = (sequelize, dataTypes) => {
    return sequelize.define("user", {
        userName: {
            type: dataTypes.STRING,
            unique: true,
            allowNull: false
        },
        userPassword: {
            type: dataTypes.STRING,
            allowNull: false
        },
        userStatus: {
            type: dataTypes.INTEGER,
            allowNull: true,
            default: 0
        },
        isAdmin: {
            type: dataTypes.INTEGER,
            allowNull: true,
            default: 0
        }
    });
}