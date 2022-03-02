const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const sequelize = new Sequelize(process.env.DOCKER_DB_NAME, process.env.DOCKER_DB_USER, process.env.DOCKER_DB_PASSWORD, {
  host: process.env.DOCKER_DB_HOST,
  dialect: "postgres",
  operatorsAliases: false,

  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

module.exports =  sequelize