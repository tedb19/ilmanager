"use strict";

module.exports = function(sequelize, DataTypes) {
  let Entity = sequelize.define("Entity", {
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    address:  {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    description: DataTypes.TEXT,
    status: {
      type:   DataTypes.ENUM,
      values: ['ACTIVE', 'INACTIVE'],
      defaultValue: 'INACTIVE'
    },
    color: {
      type:   DataTypes.ENUM,
      values: ["teal", "violet", "pink", "yellow", "purple", "green", "orange", "gray"],
      defaultValue: 'gray'
  }
  })
  
  Entity.associate = function(models) {
    Entity.belongsToMany(models.MessageType, {through: models.Subscriber})
  }
  
  return Entity
}
