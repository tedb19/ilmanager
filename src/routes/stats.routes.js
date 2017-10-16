import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'
import { getSubscribedMessageTypes } from '../logic/db.manipulation'
import { getEntitiesStatus } from '../logic/stats.logic'

exports.register = (server, options, next) => {
    server.route({
        path: '/stats/',
        method: 'GET',
        handler: async (request, reply) => {
            const data = await getEntitiesStatus()
            let stats = { data }
            reply(stats)
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

    server.route({
        path: '/stats/',
        method: 'POST',
        handler: async (request, reply) => {
            let newStat = request.payload
            try{
                const stat = await models.Stats.create(newStat)
                stat ?  reply(stat) : reply(Boom.notFound)
            } catch(err) {
                console.log(err)
                reply(Boom.notFound)
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