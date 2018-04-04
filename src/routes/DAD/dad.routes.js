/**
 * This is the Data Acquisation and Dispersal Module
 * 
 */
import Boom from 'boom'

import models from '../../models'
import { getSubscribedMessageTypes, getMessageTypeObj, getSubscribedEntities, updateStats } from '../../logic/db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from './message.manipulation'
import { messageDispatcher } from './messagedispatcher'
import { updateNumericStats } from '../../logic/stats.logic'
import { processIncoming } from './processMessage';
import { logger } from '../../utils/logger.utils'

exports.register = (server, options, next) => {
    
    const ILServer = server.select('DAD')

    ILServer.route({
        path: '/api/',
        method: 'POST',
        handler: async (request, reply) => {
            let { payload } = request
            try{
                const CCCNumber = await processIncoming(payload)
                let response = ''
                CCCNumber
                    ? response = JSON.stringify({ msg: 'successfully received by the Interoperability Layer (IL)'})
                    : response = Boom.notAcceptable('No CCC Number specified! This message will still be sent out')
                reply(response)         
            } catch(error) {
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