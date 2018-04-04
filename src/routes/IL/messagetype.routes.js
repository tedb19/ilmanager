import Boom from 'boom'

import models from '../../models'

exports.register = (server, options, next) => {

    const ILServer = server.select('IL')

    ILServer.route({
        path: '/api/messagetypes',
        method: 'GET',
        handler: (request, reply) => {
            models.MessageType
                .findAll()
                .then(messageType => reply(messageType))
                .catch (error => {
                    logger.error(`Error fetching message types: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Get the message types',
            tags: ['message types', 'hl7'],
            notes: 'should return all the message types',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/messagetypes/{id}',
        method: 'GET',
        handler: (request, reply) => {
            models.MessageType
                .findById(request.params.id)
                .then((messageType) => messageType ?  reply(messageType) : reply(Boom.notFound))
                .catch (error => {
                    logger.error(`Error fetching message type by id: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Get the message type with the specified id',
            tags: ['message types', 'hl7'],
            notes: 'should return the message type with the specified id',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/messagetypes',
        method: 'POST',
        handler: (request, reply) => {
            models.MessageType
                .create(request.payload)
                .then((messagetype) => messagetype ?  reply(messagetype) : reply(Boom.notFound))
                .catch (error => {
                    logger.error(`Error creating message type: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Create a new message type',
            tags: ['message types', 'hl7'],
            notes: 'should return the created message type',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/messagetypes/{id}',
        method: 'PUT',
        handler: (request, reply) => {
            const messageTypeId = request.params.id 
            models.MessageType
                .update(request.payload, {where: { id: messageTypeId } }) 
                .then((messageType) => messageType ?  reply(messageType) : reply(Boom.notFound))
                .catch (error => {
                    logger.error(`Error updating message type: ${error}`)
                    reply(Boom.badImplementation)
                })
        },
        config: {
            description: 'Updates an existing message type',
            tags: ['message type', 'hl7'],
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
    name: 'messagetypes.routes'
}