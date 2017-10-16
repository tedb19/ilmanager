import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'
import { getSubscribedMessageTypes } from '../logic/db.manipulation'
import { createHash } from '../utils/hashing.utils'

exports.register = (server, options, next) => {
    server.route({
        path: '/addresses',
        method: 'GET',
        handler: async (request, reply) => {            
            const addresses = await models.AddressMapping.findAll()
            reply(addresses)
        },
        config: {
            cache: {
                expiresIn: 300 * 1000,
                privacy: 'private'
            },
            description: 'Get the addresses',
            tags: ['address', 'addresses'],
            notes: 'should return all the addresses',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/addresses/{id}',
        method: 'GET',
        handler: async (request, reply) => {
            const address = await models.AddressMapping.findById(request.params.id)
            address ?  reply(address) : reply(Boom.notFound)
        },
        config: {
            description: 'Get the address with the specified id',
            tags: ['address'],
            notes: 'should return the address with the specified id',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/addresses',
        method: 'POST',
        handler: async (request, reply) => {
            try{
                const addressMapping = await models.AddressMapping.create(request.payload)
                addressMapping ?  reply(addressMapping) : reply(Boom.notFound)
            } catch(err) {
                console.log(err)
                reply(Boom.notFound)
            }
        },
        config: {
            description: 'Create a new address',
            tags: ['new address'],
            notes: 'should return the created address',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/addresses/{id}',
        method: 'PUT',
        handler: async (request, reply) => {
            const addressMappingId = request.params.id 
            let postBody = request.payload
            const address = postBody.address
            address ? postBody.status = 'ACTIVE' : postBody.status = 'INACTIVE'
            const addressMapping = await models.AddressMapping.update(postBody, {where: { id: addressMappingId } })
            addressMapping ?  reply(addressMapping) : reply(Boom.notFound)
        },
        config: {
            description: 'Updates an existing address mapping',
            tags: ['addressMapping'],
            notes: 'should return the updated address mapping',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/addresses/{entityId}',
        method: 'DELETE',
        handler: async (request, reply) => {
            const EntityId = request.params.entityId
            const addressMapping = await models.AddressMapping.destroy({
                where: { EntityId }})
            reply(addressMapping)
        },
        config: {
            description: 'Deletes an existing address mapping',
            tags: ['addressMapping'],
            notes: 'should return the deleted address mapping',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    return next()
}

exports.register.attributes = {
    name: 'addressmapping.routes'
}