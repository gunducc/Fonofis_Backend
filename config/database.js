const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    development: {
        schema: process.env.DB_SCHEMA || 'fonofis',
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'Super123',
        database: process.env.DB_NAME || 'postgres',
        host: process.env.DB_HOST,
        dialect: "postgres",
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA, 
        host: process.env.DB_HOST,
        dialect: "postgres"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        host: process.env.DB_HOST,
        dialect: "postgres"
    }
}