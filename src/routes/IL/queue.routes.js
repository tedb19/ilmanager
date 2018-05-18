import Boom from 'boom'

import models from '../../models'
import { logger } from '../../utils/logger.utils'

exports.register = (server, options, next) => {
  const ILServer = server.select('IL')

  ILServer.route({
    path: '/api/queues/{id}',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const queue = await models.Queue.findById(request.params.id)
        queue ? reply(queue.message) : reply('')
      } catch (error) {
        logger.error(`Error fetching queue message by id: ${error}`)
        reply(Boom.badImplementation)
      }
    },
    config: {
      description: 'Get the queue message with the specified id',
      tags: ['queue', 'participating system'],
      notes: 'should return the queue message with the specified id',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  return next()
}

exports.register.attributes = {
  name: 'queue.routes'
}
