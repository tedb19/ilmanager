'use strict'

module.exports = function (sequelize, DataTypes) {
  let LabCode = sequelize.define('LabCode', {
    codeType: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    codeKey: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    codeName: {
      type: DataTypes.STRING(400),
      allowNull: false
    }
  })
  return LabCode
}
