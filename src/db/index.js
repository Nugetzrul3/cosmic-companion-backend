const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize(
        {
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.DATABASE_URL,
        {
            dialect: 'postgres',
            logging: false,
        }
    );
}

module.exports = sequelize;
