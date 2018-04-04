"use strict";

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const env    = process.env.NODE_ENV || "development"
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]
const prodConfig = {
  username: process.env.USERNAME_PROP,
  password: process.env.PASSWORD_PROP,
  database: process.env.DATABASE_PROP,
  host: "localhost",
  dialect: "mssql",
  logging: false,
  operatorsAliases: false,
  options: {
    instanceName: process.env.SERVER_PROP
  }
}

const sequelize = process.env.USERNAME_PROP 
  ? new Sequelize(prodConfig.database, prodConfig.username, prodConfig.password, prodConfig) 
  : new Sequelize(config.database, config.username, config.password, config)

const db = {}

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf(".") !== 0) && (file !== "index.js"))
  .forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
