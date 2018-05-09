'use strict'

module.exports = function (sequelize, DataTypes) {
  let AddressMapping = sequelize.define('AddressMapping', {
    protocol: {
      type: DataTypes.ENUM,
      values: ['TCP', 'HTTP', 'HTTPS'],
      defaultValue: 'HTTP'
    },
    address: DataTypes.STRING(256),
    status: {
      type: DataTypes.ENUM,
      values: ['ACTIVE', 'INACTIVE'],
      defaultValue: 'ACTIVE'
    }
  })

  AddressMapping.associate = function (models) {
    AddressMapping.belongsTo(models.Entity)
  }
  return AddressMapping
}
