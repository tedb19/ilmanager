import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'

export const getSubscribedEntities = async (messageType) => {
    const messaegTypeId = messageType.id
    const entities = await messageType.getEntities({attributes: ['name','description']})
    return entities
}

export const getSubscribedMessageTypes = async (entity) => {
    const entityId = entity.id
    const messageTypes = await entity.getMessageTypes({attributes: ['name','description']})
    return messageTypes
}

export const getEntityFromSubscription = async (subscription) => {
    const entity = await models.Entity.findById(subscription.EntityId)
    return entity
}