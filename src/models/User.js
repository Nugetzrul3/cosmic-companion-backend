const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('users', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { timestamps: false });

module.exports = User;
