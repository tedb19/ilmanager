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
    description: DataTypes.TEXT
  })
  
  Entity.associate = function(models) {
    Entity.belongsToMany(models.MessageType, {through: models.Subscriber})
  }
  
  return Entity
}
