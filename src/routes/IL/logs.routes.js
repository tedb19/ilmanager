import Boom from 'boom'

import models from '../../models'
import { logger } from '../../utils/logger.utils'
import socketIo from 'socket.io'

exports.register = (server, options, next) => {
  const ILServer = server.select('IL')

  const io = (socketIo)(ILServer.listener)

  io.on('connection', (socket) => {
    socket.emit('Oh hii!')

    socket.on('burp', function () {
      socket.emit('Excuse you!')
    })
  })

  ILServer.route({
    path: '/api/logs/{page}',
    method: 'GET',
    handler: async (req, reply) => {
      let page = req.params.page // page number
      let limit = 15 // number of records per page
      let offset = page * limit
      try {
        const data = await models.Logs.findAndCountAll({
          limit,
          offset,
          order: [ ['id', 'DESC'] ],
          $sort: { id: 1 }
        })
        const pages = Math.ceil(data.count / limit)
        offset = limit * (page - 1)
        const logs = data.rows
        reply({'result': logs, 'count': data.count, 'pages': pages})
      } catch (error) {
        logger.error(`Error fetching logs by page: ${error}`)
        reply(Boom.badImplementation)
      }
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

  ILServer.route({
    path: '/api/logs/level/{level}/{page}',
    method: 'GET',
    handler: (request, reply) => {
      let page = request.params.page // page number
      let limit = 10 // number of records per page
      let offset = page * limit

      models.Logs.findAndCountAll({
        limit: limit,
        offset: offset,
        where: { level: request.params.level },
        order: [ ['id', 'DESC'] ],
        $sort: { id: 1 }
      }).then((data) => {
        let pages = Math.ceil(data.count / limit)
        offset = limit * (page - 1)
        let logs = data.rows
        reply({'result': logs, 'count': data.count, 'pages': pages})
      })
        .catch(error => {
          logger.error(`Error fetching logs by log level and page: ${error}`)
          reply(Boom.badImplementation)
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

  ILServer.route({
    path: '/api/logs/search/{searchTerm}/{page}',
    method: 'GET',
    handler: (request, reply) => {
      let page = request.params.page // page number
      let limit = 10 // number of records per page
      let offset = page * limit

      models.Logs.findAndCountAll({
        limit: limit,
        offset: offset,
        where: { log: { [models.Sequelize.Op.like]: '%' + request.params.searchTerm + '%' } },
        order: [ ['id', 'DESC'] ],
        $sort: { id: 1 }
      }).then((data) => {
        let pages = Math.ceil(data.count / limit)
        offset = limit * (page - 1)
        let logs = data.rows
        reply({'result': logs, 'count': data.count, 'pages': pages})
      })
        .catch(error => {
          logger.error(`Error searching for logs by search term and page: ${error}`)
          reply(Boom.badImplementation)
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

  ILServer.route({
    path: '/api/logs/count',
    method: 'GET',
    handler: (request, reply) => {
      models.Logs
        .findAll({
          attributes: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'no_logs']]
        })
        .then(logs => reply(logs))
        .catch(error => {
          logger.error(`Error fetching log count: ${error}`)
          reply(Boom.badImplementation)
        })
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
