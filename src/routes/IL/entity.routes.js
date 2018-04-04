import Boom from 'boom'

import models from '../../models'
import { getSubscribedMessageTypes } from '../../logic/db.manipulation'

exports.register = (server, options, next) => {
    
    const ILServer = server.select('IL')

    ILServer.route({
        path: '/api/entities',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const entities = await models.Entity.findAll({
                    include: [{
                        model: models.AddressMapping,
                        attributes: ['protocol', 'address', 'status', 'updatedAt']
                    }]
                })
                reply(entities)
            }catch (error) {
                logger.error(`Error fetching entities: ${error}`)
                reply(Boom.badImplementation)
            }  
        },
        config: {
            cache: {
                expiresIn: 300 * 1000,
                privacy: 'private'
            },
            description: 'Get the entities',
            tags: ['entity', 'entities', 'participating systems'],
            notes: 'should return all the entities',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/entities/{id}',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const entity = await models.Entity.findById(request.params.id)
                entity ?  reply(entity) : reply(Boom.notFound)
            } catch (error) {
                logger.error(`Error fetching entity by id: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Get the entity with the specified id',
            tags: ['entity', 'participating system'],
            notes: 'should return the entity with the specified id',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/entities/subscriptions/{entityName}',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const [ entity ] = await models.Entity.findAll({ where: { name: request.params.entityName }})
                const messageTypes = await getSubscribedMessageTypes(entity)
                reply(messageTypes)
            } catch (error) {
                logger.error(`Error fetching entity's subsriptions: ${error}`)
                reply(Boom.badImplementation)
            }
            
        },
        config: {
            description: 'Get the message types that the supplied entity subscribed to, including the status of the subscription',
            tags: ['entity\'s subscriptions', 'participating system\'s message types'],
            notes: 'should return the message types subscribed to by the supplied entity',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/entities',
        method: 'POST',
        handler: async (request, reply) => {
            let newEntity = request.payload
            try{
                const entity = await models.Entity.create(newEntity)
                entity ?  reply(entity) : reply(Boom.notFound)
            } catch (error) {
                logger.error(`Error fetching entity's subsriptions: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Create a new entity',
            tags: ['entity', 'participating system'],
            notes: 'should return the created entity',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/entities/{id}',
        method: 'PUT',
        handler: async (request, reply) => {
            try{
                const entityId = request.params.id 
                let postBody = request.payload
                const entity = await models.Entity.update(postBody, {where: { id: entityId } })
                entity ?  reply(entity) : reply(Boom.notFound)
            } catch (error) {
                logger.error(`Error updating entity: ${error}`)
                reply(Boom.badImplementation)
            }
            
        },
        config: {
            description: 'Updates an existing entity',
            tags: ['entity', 'participating system'],
            notes: 'should return the updated entity',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    return next()
}

exports.register.attributes = {
    name: 'entity.routes'
}