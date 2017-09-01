"use strict";

module.exports = function(sequelize, DataTypes) {
  let Stats = sequelize.define("Stats", {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    value: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    description: DataTypes.TEXT
  })  
  return Stats
}
