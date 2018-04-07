import Boom from 'boom'

import models from '../../models'
import { logger } from '../../utils/logger.utils'
import { saveIncomingToQueue } from '../DAD/processMessage'
import { generatePayload } from './labresult.payload'

exports.register = (server, options, next) => {
  const VLServer = server.select('VL')

  VLServer.route({
    path: '/labresults',
    method: 'POST',
    handler: async (request, reply) => {
      const log = `Received Viral Result via API endpoint: ${request.payload}`
      logger.info(log)
      models.Logs.create({level: 'INFO', log})
      // save the lab result
      reply(true)
    },
    config: {
      cache: {
        expiresIn: 300 * 1000,
        privacy: 'private'
      },
      description: 'Receives a new lab result from the APHL system',
      tags: ['lab results'],
      notes: 'should return the new lab result',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  VLServer.route({
    path: '/labresults/sms',
    method: 'POST',
    handler: async (request, reply) => {
      try {
        const message = JSON.parse(JSON.stringify(request.payload)).message
        if (message.startsWith('IL')) {
          const encodedVL = message.slice(3)
          const decodedVL = Buffer.from(encodedVL, 'base64').toString('utf-8')
          server.log(['app', 'lab', 'info'], `Decoded sms: ${decodedVL}`)
          const payload = decodedVL.split(',')
          let labResult = {}
          labResult.labResultId = payload[0].split(':')[1].trim()
          labResult.CCCNumber = payload[1].split(':')[1].trim()
          labResult.age = payload[2].split(':')[1].trim()
          labResult.sex = payload[3].split(':')[1].trim()
          labResult.dateSampleCollected = payload[4].split(':')[1].trim()
          labResult.orderDate = payload[5].split(':')[1].trim()
          labResult.sampleRejection = payload[6].split(':')[1].trim()
          labResult.sampleType = payload[7].split(':')[1].trim()
          labResult.justification = payload[8].split(':')[1].trim()
          labResult.VLResult = payload[9].replace(/Result:/g, '').trim()
          labResult.mflCode = payload[10].split(':')[1].trim()
          labResult.lab = payload[11].split(':')[1].trim()

          const VLpayload = await generatePayload(labResult)
          await saveIncomingToQueue(VLpayload)
          reply({msg: 'results saved successfully!'})
        } else {
          reply({msg: 'Not a valid VL result!'})
        }
      } catch (error) {
        server.log(['app', 'lab', 'error'], error)
        reply(Boom.badImplementation)
      }
    },
    config: {
      cache: {
        expiresIn: 300 * 1000,
        privacy: 'private'
      },
      description: 'Receives a new lab result from the MLAB SMS app',
      tags: ['lab results', 'sms'],
      notes: 'should return the new lab result',
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  return next()
}

exports.register.attributes = {
  name: 'labresult.routes'
}
