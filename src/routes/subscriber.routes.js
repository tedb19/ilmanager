import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'
import { getSubscribedEntities, getMessageTypeObj } from '../logic/db.manipulation'

exports.register = (server, options, next) => {

    server.route({
        path: '/subscribers/{messageType}',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const messageType = await getMessageTypeObj(request.params.messageType)
                const entities = await getSubscribedEntities(messageType)
                reply(entities)
            } catch (error) {
                log.error(error)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Get the entities that have subscribed to a given message type',
            tags: ['subscription'],
            notes: 'should return all the message types'
        }
    })

    server.route({
        path: '/subscribers',
        method: 'POST',
        handler: (request, reply) => {
            models.Subscriber
                .create(request.payload)
                .then((messagetype) => messagetype ?  reply(messagetype) : reply(Boom.notFound))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Create a new subscription',
            tags: ['subscription'],
            notes: 'should return the created subscription'
        }
    })

    server.route({
        path: '/subscribers/{id}',
        method: 'PUT',
        handler: (request, reply) => {
            const messageTypeId = request.params.id 
            models.Subscriber
                .update(request.payload, {where: { id: messageTypeId } }) 
                .then((messageType) => messageType ?  reply(messageType) : reply(Boom.notFound))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Updates an existing message type',
            tags: ['subscription'],
            notes: 'should return the updated message type'
        }
    })

    return next()
}

exports.register.attributes = {
    name: 'subscriber.routes'
}