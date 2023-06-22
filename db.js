const { Sequelize } = require('sequelize');
require('dotenv').config()

// Option 1: Passing a connection URI
const sequelize = new Sequelize(process.env.DB_LINK) // Example for postgres
module.exports = sequelize