"use strict";

module.exports = function(sequelize, DataTypes) {
  let Queue = sequelize.define("Queue", {
    message: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    noOfAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['SENT', 'QUEUED', 'ERROR'],
      defaultValue: 'QUEUED'
    },
    sendDetails: DataTypes.TEXT('long')
  },{
      tableName: 'queue'
  })

  Queue.associate = function(models) {
    Queue.belongsTo(models.Entity)
  }
  
  return Queue
}
