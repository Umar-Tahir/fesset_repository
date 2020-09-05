/*
Created by Umar Tahir
*/

module.exports = (sequelize, dataTypes) => {
    return sequelize.define('customer', {
        customerName: {
            type: dataTypes.STRING,
            allowNull: false
        },
        customerEmail: {
            type: dataTypes.STRING,
            allowNull: true,
            unique: true
        },
        customerPhoneNumber: {
            type: dataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    })
}