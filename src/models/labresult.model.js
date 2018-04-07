'use strict'

module.exports = function (sequelize, DataTypes) {
  let LabResult = sequelize.define('LabResult', {
    labResultId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    dateSampleCollected: DataTypes.STRING(20),
    dateSampleTested: DataTypes.STRING(20),
    orderDate: DataTypes.STRING(20),
    mflCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lab: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    VLResult: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sampleType: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    justification: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    sampleRejection: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CCCNumber: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  })
  return LabResult
}
