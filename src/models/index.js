'use strict'

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const env = process.env.NODE_ENV || 'development'
const platform = process.env.PLATFORM || 'windows'

const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]
const defaults = {
  username: process.env.USERNAME_PROP,
  password: process.env.PASSWORD_PROP,
  database: process.env.DATABASE_PROP,
  host: 'localhost',
  logging: true,
  operatorsAliases: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

let prodConfig = {}
if (platform === 'windows') {
  prodConfig = {
    ...defaults,
    dialect: 'mssql',
    options: {
      instanceName: process.env.SERVER_PROP
    }
  }
} else {
  prodConfig = {
    ...defaults,
    dialect: 'mysql'
  }
}

const sequelize = process.env.USERNAME_PROP
  ? new Sequelize(
    prodConfig.database,
    prodConfig.username,
    prodConfig.password,
    prodConfig
  )
  : new Sequelize(config.database, config.username, config.password, config)

const db = {}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
