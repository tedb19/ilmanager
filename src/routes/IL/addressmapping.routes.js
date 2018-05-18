import Boom from 'boom'

import models from '../../models'
import { getActiveEntities } from '../../logic/stats.logic'
import { logger } from '../../utils/logger.utils'

exports.register = (server, options, next) => {
  const ILServer = server.select('IL')

  ILServer.route({
    path: '/api/addresses',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const addresses = await models.AddressMapping.findAll()
        reply(addresses)
      } catch (error) {
        logger.error(`Error fetching addresses: ${error}`)
        reply(Boom.badImplementation)
      }
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

  ILServer.route({
    path: '/api/activeSystems',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const addresses = await getActiveEntities()
        const addressNames = addresses.map(address => address.name)
        reply(addressNames)
      } catch (error) {
        logger.error(`Error fetching the active systems: ${error}`)
        reply(Boom.badImplementation)
      }
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

  ILServer.route({
    path: '/api/addresses/{id}',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const address = await models.AddressMapping.findAll({ where: { EntityId: request.params.id } })
        address ? reply(address) : reply({})
      } catch (error) {
        logger.error(`Error fetching address by id: ${error}`)
        reply(Boom.badImplementation)
      }
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

  ILServer.route({
    path: '/api/addresses',
    method: 'POST',
    handler: async (request, reply) => {
      try {
        const data = request.payload.protocol === 'HTTP' && !request.payload.address.includes('http')
          ? {...request.payload, address: `http://${request.payload.address}`}
          : request.payload
        const addressMapping = await models.AddressMapping.create(data)
        addressMapping ? reply(addressMapping) : reply(Boom.notFound)
      } catch (error) {
        logger.error(`Error creating new address: ${error}`)
        reply(Boom.badImplementation)
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

  ILServer.route({
    path: '/api/addresses/{id}',
    method: 'PUT',
    handler: async (request, reply) => {
      try {
        const addressMappingId = request.params.id
        let postBody = request.payload
        const address = postBody.address
        address ? postBody.status = 'ACTIVE' : postBody.status = 'INACTIVE'
        const addressMapping = await models.AddressMapping.update(postBody, {where: { id: addressMappingId }})
        addressMapping ? reply(addressMapping) : reply(Boom.notFound)
      } catch (error) {
        logger.error(`Error updating address: ${error}`)
        reply(Boom.badImplementation)
      }
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

  ILServer.route({
    path: '/api/addresses/{entityId}',
    method: 'DELETE',
    handler: async (request, reply) => {
      const EntityId = request.params.entityId
      try {
        const addressMapping = await models.AddressMapping.destroy({ where: { EntityId } })
        reply(addressMapping)
      } catch (error) {
        logger.error(`Error deleting address: ${error}`)
        reply(Boom.badImplementation)
      }
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
