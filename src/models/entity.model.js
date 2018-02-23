"use strict";

module.exports = function(sequelize, DataTypes) {
  let Entity = sequelize.define("Entity", {
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    status: {
      type:   DataTypes.ENUM,
      values: ['ACTIVE', 'INACTIVE'],
      defaultValue: 'INACTIVE'
    },
    color: {
      type:   DataTypes.ENUM,
      values: ["teal", "violet", "pink", "yellow", "brown", "purple", "green", "orange", "blue", "red", "olive", "grey", "black"],
      defaultValue: 'grey'
  }
  })
  
  Entity.associate = function(models) {
    Entity.belongsToMany(models.MessageType, {through: models.Subscriber})
    Entity.hasMany(models.AddressMapping)
    Entity.hasMany(models.Queue)
  }

  return Entity
}
