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
            const entitiesOnline = await getEntitiesStatus()
            let stats = { entitiesOnline }
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

    return next()
}

exports.register.attributes = {
    name: 'stats.routes'
}