import Boom from 'boom'

import models from '../../models'
import { logger } from '../../utils/logger.utils'

exports.register = (server, options, next) => {
  const ILServer = server.select('IL')

  ILServer.route({
    path: '/api/settings',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const settings = await models.Settings.findAll()
        reply(settings)
      } catch (error) {
        logger.error(`Error fetching settings: ${error}`)
        reply(Boom.badImplementation)
      }
    },
    config: {
      cache: {
        expiresIn: 300 * 1000,
        privacy: 'private'
      },
      description: 'Get the settings',
      tags: ['settings'],
      notes: 'should return all the settings',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  ILServer.route({
    path: '/api/settings/{id}',
    method: 'PUT',
    handler: async (request, reply) => {
      try {
        const settingsId = request.params.id
        let postBody = request.payload
        const setting = await models.Settings.update(postBody, { where: { id: settingsId } })
        setting ? reply(setting) : reply(Boom.notFound)
      } catch (error) {
        logger.error(`Error updating entity: ${error}`)
        reply(Boom.badImplementation)
      }
    },
    config: {
      description: 'Updates an existing setting',
      tags: ['setting update'],
      notes: 'should return the updated setting',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  return next()
}

exports.register.attributes = {
  name: 'settings.routes'
}
