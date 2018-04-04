import Boom from 'boom'

import models from '../../models'
import { getSubscribedEntities, getMessageTypeObj, getSubscribedMessageTypes } from '../../logic/db.manipulation'
import { logger } from '../../utils/logger.utils';

exports.register = (server, options, next) => {

    const ILServer = server.select('IL')

    ILServer.route({
        path: '/api/subscribers',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const messageTypes = await models.MessageType.findAll()
                const messageSubscribers = []
                for(let messageType of messageTypes){
                    const subscribersObjs = await getSubscribedEntities(messageType)
                    const subscribers = subscribersObjs.map(subscriber => ({ name: subscriber.name, color: subscriber.color}))
                    messageSubscribers.push({ messageType: messageType.verboseName, subscribers })
                }
                reply(messageSubscribers)
            } catch (error) {
                logger.error(`Error fetching subscribers: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Get the subscribers of the message type',
            tags: ['subscribers'],
            notes: 'should return all the message types, with all their subscribers',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/entitysubscriptions',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const entities = await models.Entity.findAll()
                const messageSubscribers = []
                for(let entity of entities){
                    const messageTypesObjs = await getSubscribedMessageTypes(entity)
                    const messageTypes = messageTypesObjs.map(messageType => messageType.verboseName)
                    messageSubscribers.push({ entity: entity.name, messageTypes })
                }
                reply(messageSubscribers)
            } catch (error) {
                logger.error(`Error fetching entity subscriptions: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Get the entities and the message types they\'ve subscribed to',
            tags: ['subscribers'],
            notes: 'should return all the message types, with all their subscribers',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/subscribers/{messageType}',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const messageType = await getMessageTypeObj(request.params.messageType)
                const entities = await getSubscribedEntities(messageType)
                reply(entities)
            } catch (error) {
                logger.error(`Error fetching message type subscriptions: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Get the entities that have subscribed to a given message type',
            tags: ['subscription'],
            notes: 'should return all the message types',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/subscribers',
        method: 'POST',
        handler: (request, reply) => {
            models.Subscriber
                .create(request.payload)
                .then((messagetype) => messagetype ?  reply(messagetype) : reply(Boom.notFound))
                .catch(error => {
                    logger.error(`Error creating subscription: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Create a new subscription',
            tags: ['subscription'],
            notes: 'should return the created subscription',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/subscribers/{id}',
        method: 'PUT',
        handler: (request, reply) => {
            const messageTypeId = request.params.id 
            models.Subscriber
                .update(request.payload, {where: { id: messageTypeId } }) 
                .then((messageType) => messageType ?  reply(messageType) : reply(Boom.notFound))
                .catch(error => {
                    logger.error(`Error updating subscription: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Updates an existing message type',
            tags: ['subscription'],
            notes: 'should return the updated message type',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/subscribers/{entityId}/{messageTypeId}',
        method: 'DELETE',
        handler: async (request, reply) => {
            const messageTypeId = request.params.messageTypeId
            const entityId = request.params.entityId 
            try{
                await models.Subscriber.destroy({
                    where: { EntityId: entityId, MessageTypeId: messageTypeId }
               })
               reply({ EntityId: entityId, MessageTypeId: messageTypeId })
            } catch(error) {
                logger.error(`Error deleting subscription: ${error}`)
                reply(Boom.badImplementation)
            }            
        },
        config: {
            description: 'Delete the subscription matching the entity and the message type',
            tags: ['subscription', 'delete'],
            notes: 'should return the updated message type',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    return next()
}

exports.register.attributes = {
    name: 'subscriber.routes'
}