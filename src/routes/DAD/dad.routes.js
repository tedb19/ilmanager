/**
 * This is the Data Acquisation and Dispersal Module
 *
 */
import { saveXMLToQueue, savePayload } from './saveIncomingToQueue'

exports.register = (server, options, next) => {
  const ILServer = server.select('DAD')

  ILServer.route({
    path: '/api',
    method: 'POST',
    handler: async (request, reply) => {
      let { payload } = request
      const response = await savePayload(JSON.stringify(payload))
      reply(response)
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

  ILServer.ext('onRequest', function (request, reply) {
    if (
      request.method === 'post' &&
      request.headers['content-type'] === 'application/adx+xml'
    ) {
      request.setUrl('/api/adx')
    }
    return reply.continue()
  })

  ILServer.route({
    path: '/api/adx',
    method: 'POST',
    handler: async (request, reply) => {
      let { payload } = request
      let log = {
        log:
          'ADX message successfully received by the Interoperability Layer (IL)',
        level: 'INFO'
      }
      await saveXMLToQueue(Buffer.from(payload).toString())
      reply({ msg: log.log })
    },
    config: {
      payload: {
        parse: false,
        allow: 'application/adx+xml'
      },
      description: 'The endpoint for receiving incoming ADX messages.',
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
