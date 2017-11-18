"use strict";

module.exports = function(sequelize, DataTypes) {
  let LabOrder = sequelize.define("LabOrder", {
    orderNumber: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    orderDateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    patientID: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    patientName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    gender: {
      type:   DataTypes.ENUM,
      values: ['M', 'F']
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ageUnit: {
      type:   DataTypes.ENUM,
      values: ['YEARS', 'MONTHS', 'DAYS'],
      defaultValue: 'YEARS'
    },
    clinicianName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    investigation: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    testNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    receiptNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    transferFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    requestTransferredDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    timestamps: false
  })
  return LabOrder
}
