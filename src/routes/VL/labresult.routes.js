import Boom from 'boom'

import models from '../../models'

exports.register = (server, options, next) => {

    const VLServer = server.select('VL')

    VLServer.route({
        path: '/labresults',
        method: 'POST',
        handler: async (request, reply) => {
            server.log(['app', 'lab', 'info'], request.payload)
            //save the lab result
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
            server.log(['app', 'lab', 'info'], `Incoming encoded sms: ${request.payload}`)
            const message = JSON.parse(JSON.stringify(request.payload)).message
            if(message.startsWith('IL')){
                try {
                    const encodedVL = message.slice(3)
                    const decodedVL = Buffer.from(encodedVL, 'base64').toString('utf-8')
                    server.log(['app', 'lab', 'info'], `Decoded sms: ${decodedVL}`)
                    const payload = decodedVL.split(',')
                    let labResult = {}
                    labResult.labResultId = payload[0].split(':')[1]
                    labResult.CCCNumber = payload[1].split(':')[1]
                    labResult.age = payload[2].split(':')[1]
                    labResult.sex = payload[3].split(':')[1]
                    labResult.dateSampleCollected = payload[4].split(':')[1]
                    labResult.orderDate = payload[5].split(':')[1]
                    labResult.sampleRejection = payload[6].split(':')[1]
                    labResult.sampleType = payload[7].split(':')[1]
                    labResult.justification = payload[8].split(':')[1]
                    labResult.VLResult = payload[9].replace(/Result:/g, '')
                    labResult.mflCode = payload[10].split(':')[1]
                    labResult.lab = payload[11].split(':')[1]
                    const savedLabResult = await models.LabResult.create(labResult)
                    reply({msg: 'results saved successfully!'})
                } catch(error) {
                    server.log(['app', 'lab', 'error'], error)
                    reply(Boom.badImplementation)
                }
            } else {
                reply({msg: 'Not a valid VL result!'})
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