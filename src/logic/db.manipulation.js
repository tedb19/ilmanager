import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'

export const getSubscribedEntities = async (messageType) => {
    const messaegTypeId = messageType.id
    const entities = await messageType.getEntities({attributes: ['name','description', 'color']})
    return entities
}

export const getSubscribedMessageTypes = async (entity) => {
    const EntityId = entity.id
    const entitySubscriptions = await models.Subscriber.findAll({ where: { EntityId }})
    let messageTypes = []
    for(let entitySubscription of entitySubscriptions){
        const [messageType] = await models.MessageType.findAll({ where: { id: entitySubscription.dataValues.MessageTypeId }})
        console.log('messageType', messageType)
        messageTypes.push(messageType)
    }
    
    return messageTypes
}

export const getEntityFromSubscription = async (subscription) => {
    const entity = await models.Entity.findById(subscription.EntityId)
    return entity
}

export const getMessageTypeObj = async (messageTypeName) => {
    const [ messageType ] = await models.MessageType.findAll({ where: { verboseName: messageTypeName }})
    return messageType
}