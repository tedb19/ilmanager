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
        const settings = await models.Settings.findAll({ where: { display: true } })
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
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const id = request.params.id
        const [setting] = await models.Settings.findAll({ where: { id } })
        reply(setting)
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
    path: '/api/authentication',
    method: 'POST',
    handler: async (request, reply) => {
      try {
        let login = request.payload
        let password = ''
        let success = 0

        switch (login.username) {
          case 'super':
            let [setting] = await models.Settings.findAll({ where: { description: 'IL Super password' } })
            password = setting.value
            success = setting.id
            break
          case 'admin':
            [setting] = await models.Settings.findAll({ where: { description: 'IL Admin user password' } })
            password = setting.value
            success = setting.id
            break
          default:
            success = 0
            break
        }

        if (login.password !== password) success = 0
        reply(success)
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
