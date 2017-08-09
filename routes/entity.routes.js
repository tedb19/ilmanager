import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'
import { getSubscribedMessageTypes } from '../logic/db.manipulation'

exports.register = (server, options, next) => {
    server.route({
        path: '/entities',
        method: 'GET',
        handler: (request, reply) => {
            models.Entity
                .findAll()
                .then(entities => reply(entities))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Get the entities',
            tags: ['entity', 'entities', 'participating systems'],
            notes: 'should return all the entities'
        }
    })

    server.route({
        path: '/entities/{id}',
        method: 'GET',
        handler: (request, reply) => {
            models.Entity
                .findById(request.params.id)
                .then((entity) => entity ?  reply(entity) : reply(Boom.notFound))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Get the entity with the specified id',
            tags: ['entity', 'participating system'],
            notes: 'should return the entity with the specified id'
        }
    })

    server.route({
        path: '/entities/subscriptions/{entityName}',
        method: 'GET',
        handler: async (request, reply) => {
            const [ entity ] = await models.Entity.findAll({ where: { name: request.params.entityName }})
            const messageTypes = await getSubscribedMessageTypes(entity)
            reply(messageTypes)
        },
        config: {
            description: 'Get the message types that the supplied entity subscribed to, including the status of the subscription',
            tags: ['entity\'s subscriptions', 'participating system\'s message types'],
            notes: 'should return the message types subscribed to by the supplied entity'
        }
    })

    server.route({
        path: '/entities',
        method: 'POST',
        handler: (request, reply) => {
            models.Entity
                .create(request.payload)
                .then((entity) => entity ?  reply(entity) : reply(Boom.notFound))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Create a new entity',
            tags: ['entity', 'participating system'],
            notes: 'should return the created entity'
        }
    })

    server.route({
        path: '/entities/{id}',
        method: 'PUT',
        handler: (request, reply) => {
            const entityId = request.params.id 
            models.Entity
                .update(request.payload, {where: { id: entityId } }) 
                .then((entity) => entity ?  reply(entity) : reply(Boom.notFound))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Updates an existing entity',
            tags: ['entity', 'participating system'],
            notes: 'should return the updated entity'
        }
    })

    return next()
}

exports.register.attributes = {
    name: 'entity.routes'
}