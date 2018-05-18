'use strict'

module.exports = function (sequelize, DataTypes) {
  let Queue = sequelize.define('Queue', {
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['JSON', 'XML'],
      defaultValue: 'JSON'
    },
    noOfAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['SENT', 'QUEUED', 'ERROR'],
      defaultValue: 'QUEUED'
    },
    sendDetails: DataTypes.TEXT('long')
  }, {
    tableName: 'queue'
  })

  Queue.associate = function (models) {
    Queue.belongsTo(models.Entity)
    Queue.hasMany(models.Logs)
  }

  return Queue
}
