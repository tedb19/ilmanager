/**
 * This is the Data Acquisation and Dispersal Module
 *
 */
import Boom from 'boom'

import { saveIncomingToQueue } from './processMessage'
import { logger } from '../../utils/logger.utils'

exports.register = (server, options, next) => {
  const ILServer = server.select('DAD')

  ILServer.route({
    path: '/api/',
    method: 'POST',
    handler: async (request, reply) => {
      let { payload } = request

      try {
        const result = await saveIncomingToQueue(payload)
        let response = ''
        result.CCCNumber
          ? response = JSON.stringify({ msg: 'successfully received by the Interoperability Layer (IL)' })
          : response = Boom.notAcceptable('No CCC Number specified! This message will still be sent out')
        reply(response)
      } catch (error) {
        logger.error(`Error : ${error}`)
        reply(Boom.badImplementation)
      }
    },
    config: {
      description: 'The endpoint for receiving incoming messages.',
      tags: ['entity', 'participating system'],
      notes: 'should return the created entity',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  return next()
}

exports.register.attributes = {
  name: 'dad.routes'
}
