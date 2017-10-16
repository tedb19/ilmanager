import Boom from 'boom'

import models from '../models'
import { log } from '../utils/log.utils'
import { getSubscribedMessageTypes } from '../logic/db.manipulation'

exports.register = (server, options, next) => {
    server.route({
        path: '/logs/{page}',
        method: 'GET',
        handler: async (req, reply) => {
            let page = req.params.page;      // page number
            let limit = 15;   // number of records per page
            let offset = page * limit;
                
            const data = await models.Logs.findAndCountAll({
                limit, offset,
                order: [ ['id', 'DESC']],
                $sort: { id: 1 }
            })
            const pages = Math.ceil(data.count / limit)
            offset = limit * (page - 1)
            const logs = data.rows
            reply({'result': logs, 'count': data.count, 'pages': pages})
        },
        config: {
            description: 'Get the logs',
            tags: ['logs', 'log'],
            notes: 'should return all the logs',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/logs/level/{level}/{page}',
        method: 'GET',
        handler: (request, reply) => {
            let page = request.params.page;      // page number
            let limit = 10;   // number of records per page
            let offset = page * limit;
                
            models.Logs.findAndCountAll({
                limit: limit,
                offset: offset,
                where: { level: request.params.level },
                order: [ ['createdAt', 'DESC']],
                $sort: { id: 1 }
            }).then((data) => {
                let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                let logs = data.rows;
                reply({'result': logs, 'count': data.count, 'pages': pages})
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        config: {
            description: 'Get the logs',
            tags: ['logs', 'log'],
            notes: 'should return all the logs',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: '/logs/search/{searchTerm}/{page}',
        method: 'GET',
        handler: (request, reply) => {
            let page = request.params.page;      // page number
            let limit = 10;   // number of records per page
            let offset = page * limit;
                
            models.Logs.findAndCountAll({
                limit: limit,
                offset: offset,
                where: { log: { $like: '%'+ request.params.searchTerm +'%' } },
                order: [ ['createdAt', 'DESC']],
                $sort: { id: 1 }
            }).then((data) => {
                let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                let logs = data.rows;
                reply({'result': logs, 'count': data.count, 'pages': pages})
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        config: {
            description: 'Get the logs',
            tags: ['logs', 'log'],
            notes: 'should return all the logs',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })


    server.route({
        path: '/logs/count',
        method: 'GET',
        handler: (request, reply) => {
            models.Logs
                .findAll({
                    attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'no_logs']]
                })
                .then(logs => reply(logs))
                .catch(error => log.error(error))
        },
        config: {
            description: 'Get the logs count',
            tags: ['logs', 'total logs'],
            notes: 'should return the count of logs',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })
    return next()
}

exports.register.attributes = {
    name: 'logs.routes'
}