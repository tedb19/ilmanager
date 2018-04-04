import Boom from 'boom'

import models from '../../models'
import { getSubscribedMessageTypes } from '../../logic/db.manipulation'
import { getEntitiesStatus } from '../../logic/stats.logic'
import { logger } from '../../utils/logger.utils';

exports.register = (server, options, next) => {

    const ILServer = server.select('IL')

    ILServer.route({
        path: '/api/stats/',
        method: 'GET',
        handler: async (request, reply) => {
            try{
                const data = await getEntitiesStatus()
                let stats = { data }
                reply(stats)
            } catch (error) {
                logger.error(`Error fetching stats: ${error}`)
                reply(Boom.badImplementation)
            }            
        },
        config: {
            description: 'Get the stats for the dashboard',
            tags: ['stats'],
            notes: 'should return all the stats',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    ILServer.route({
        path: '/api/stats/',
        method: 'POST',
        handler: async (request, reply) => {
            let newStat = request.payload
            try{
                const stat = await models.Stats.create(newStat)
                stat ?  reply(stat) : reply(Boom.notFound)
            } catch (error) {
                logger.error(`Error creating stats: ${error}`)
                reply(Boom.badImplementation)
            }
        },
        config: {
            description: 'Create a new stat',
            tags: ['stats'],
            notes: 'should return the created stat',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })
    return next()
}

exports.register.attributes = {
    name: 'stats.routes'
}