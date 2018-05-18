'use strict'

module.exports = function (sequelize, DataTypes) {
  let Logs = sequelize.define('Logs', {
    log: DataTypes.TEXT,
    level: {
      type: DataTypes.ENUM,
      values: ['INFO', 'ERROR', 'WARNING'],
      defaultValue: 'INFO'
    }
  })

  Logs.associate = function (models) {
    Logs.belongsTo(models.Queue)
  }
  return Logs
}
