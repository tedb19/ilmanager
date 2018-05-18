'use strict'

module.exports = function (sequelize, DataTypes) {
  let Subscriber = sequelize.define('Subscriber', {
    status: {
      type: DataTypes.ENUM,
      values: ['ACTIVE', 'INACTIVE'],
      defaultValue: 'ACTIVE'
    }
  })

  return Subscriber
}

// MessageSubscriber.rawAttributes.states.values returns the values array
