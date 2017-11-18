import Boom from 'boom'
import jsonxml from 'jsontoxml'

import models from '../../models'


exports.register = (server, options, next) => {

    const VLServer = server.select('VL')

    VLServer.route({
        path: '/laborder',
        method: 'GET',
        handler: async (request, reply) => {
            try {
                const labOrders = await models.LabOrder.findAll({ where: { transferFlag: false }})
                const newLabs = labOrders.map((labOrder, idx) => ({idx: labOrder}))
                reply(jsonxml(JSON.stringify(newLabs))).type('application/xml')
            } catch(error) {
                server.log(['error', 'app', 'lab'], `Error fetching lab orders: ${error}`)
                reply(Boom.badImplementation)
            }
            
        },
        config: {
            cache: {
                expiresIn: 300 * 1000,
                privacy: 'private'
            },
            description: 'Get the existing lab orders that have not yet been transfered to the reference lab.',
            tags: ['lab order', 'lab orders'],
            notes: 'should return all the lab orders with a transfer flag of False',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with', 'application/xml']
            }
        }
    })

    VLServer.route({
        path: '/laborder/processed',
        method: 'POST',
        handler: async (request, reply) => {
            try{
                server.log(['info', 'app', 'lab'], request.payload)
                //update transferFlag to true
                reply(true)
            } catch(error) {
                server.log(['error', 'app', 'lab'], `Error fetching lab orders: ${error}`)
                reply(Boom.badImplementation)
            }
            
        },
        config: {
            cache: {
                expiresIn: 300 * 1000,
                privacy: 'private'
            },
            description: 'The reference lab sends back the received lab order so that we can update it\'s transfer flag',
            tags: ['lab order', 'lab orders'],
            notes: 'should return all the lab orders',
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })
    
    return next()
}

exports.register.attributes = {
    name: 'laborder.routes'
}