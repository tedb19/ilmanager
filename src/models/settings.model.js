'use strict'

module.exports = function (sequelize, DataTypes) {
  let Settings = sequelize.define('Settings', {
    value: {
      type: DataTypes.STRING(60),
      defaultValue: null
    },
    description: DataTypes.TEXT,
    isUpdatable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  return Settings
}
