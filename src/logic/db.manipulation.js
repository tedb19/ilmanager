import Boom from 'boom'

import models from '../models'
import { getDayOfWeek } from '../routes/DAD/message.manipulation';

const Op = models.Sequelize.Op

export const getSubscribedEntities = async (messageType) => {
    const entities = await messageType.getEntities({attributes: ['id', 'name','description', 'color']})
    return entities
}

export const getSubscribedMessageTypes = async (entity) => {
    const EntityId = entity.id
    const entitySubscriptions = await models.Subscriber.findAll({ where: { EntityId }})
    let messageTypes = []
    for(let entitySubscription of entitySubscriptions){
        const [messageType] = await models.MessageType.findAll({ where: { id: entitySubscription.dataValues.MessageTypeId }})
        messageTypes.push(messageType)
    }
    
    return messageTypes
}

export const getEntityFromSubscription = async (subscription) => {
    const entity = await models.Entity.findById(subscription.EntityId)
    return entity
}

export const getMessageTypeObj = async (messageTypeName) => {
    const [ messageType ] = await models.MessageType.findAll({ 
        where: {
            [Op.or]: [{ verboseName: messageTypeName }, { name: messageTypeName }]
        }
    })

    return messageType
}

export const updateStats = async (messageType) => {
    const suffix = '_MESSAGETYPE'
    const dayOfWeek = getDayOfWeek()

    const [ [currentMessageTypeStats], [currentDayOfWeekStats] ] = await Promise.all([
        models.Stats.findAll({ where: { name: messageType.verboseName + suffix }}),
        models.Stats.findAll({ where: { name: dayOfWeek }})
    ])

    const newMsgTypeStatsValue = parseInt(currentMessageTypeStats.value) + 1
    const newDayOfWeekStats = parseInt(currentDayOfWeekStats.value) + 1
    const updatedStats = await Promise.all([
        models.Stats.update({...currentMessageTypeStats.dataValues, value: newMsgTypeStatsValue}, {where: { name: messageType.verboseName + suffix }}),
        models.Stats.update({...currentDayOfWeekStats.dataValues, value: newDayOfWeekStats}, {where: { name: dayOfWeek }}),
    ])
    return updatedStats
}
