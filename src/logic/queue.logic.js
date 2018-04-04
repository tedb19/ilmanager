import models from '../models'
import { getSubscribedMessageTypes, getMessageTypeObj, getSubscribedEntities } from './db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from '../routes/DAD/message.manipulation'
import { messageDispatcher } from '../routes/DAD/messagedispatcher'
import { updateNumericStats, updateMsgStats } from './stats.logic'
import { logger } from '../utils/logger.utils';

export const queueManager = () => {
    setInterval(async () => {
        try{
            await processAllQueued()
            //await pruneQueue()
        } catch(error){
            logger.error(error)
        }
    }, 2000)
}

export const QueuePruner = () => {
    setInterval(async () => {
        try{
            await pruneQueue()
        } catch(error){
            logger.error(error)
        }
    }, 60000*60*24)
}

const pruneQueue = async () => {
    await models.Queue.destroy({
        where: {
          status: 'SENT'
        }
      })
}

export const processAllQueued = async () => {
    const queuedMessages = await models.Queue.findAll({ where: { status: 'QUEUED' }})
    for(let queuedMessage of queuedMessages) {
        await processQueued(queuedMessage)
    }
    await updateMsgStats('QUEUED')
    await updateMsgStats('SENT')
}

export const processQueued = async (queue) => {
    const payload = JSON.parse(queue.message)
    const messageTypeName = getMessageTypeName(payload)
    const sendingApplication = getSendingApplication(payload)
    const [ messageType, entity ] = await Promise.all([
        getMessageTypeObj(messageTypeName),
        models.Entity.findById(queue.EntityId)
    ])
    const [addressMapping] = await models.AddressMapping.findAll({ where: { EntityId: entity.id }})
    const CCCNumber = getCCCNumber(payload)
    let forwardingMsgLog = ''

    let identifier = {}
    if(CCCNumber) {
        identifier.IDENTIFIER_TYPE = CCCNumber.IDENTIFIER_TYPE
        identifier.ID = CCCNumber.ID
    } else {
        const randomIdentifier = getRandomIdentifier(payload)
        identifier.IDENTIFIER_TYPE = randomIdentifier.IDENTIFIER_TYPE
        identifier.ID = randomIdentifier.ID
    }

    forwardingMsgLog = 
            `Sending ${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) from ${sendingApplication} to ${entity.name}. `
    
    if(queue.noOfAttempts > 0) forwardingMsgLog = forwardingMsgLog +`Total send attempts are now ${queue.noOfAttempts}`
    

    if(addressMapping.protocol === 'TCP') {
        const client = await messageDispatcher.sendTCP(addressMapping.address, JSON.stringify(payload))

        client.on('data', async (data) => {
            let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) sent to ${entity.name} successfully! Total send attempts: ${queue.noOfAttempts+1}.`
            const statsChanges = [
                {name: 'SENT', increment: true},
                {name: 'QUEUED', increment: false}
            ]
            await Promise.all([
                models.Logs.create({level: 'INFO', log: sentLog, QueueId: queue.id}),
                queue.update({ status: 'SENT', sendDetails: sentLog, noOfAttempts: `${queue.noOfAttempts+1}`}),
                updateNumericStats(statsChanges)
            ])
        })

        client.on('error', async (error) => {
            let queueLog = `An attempt was made to send ${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) to ${entity.name} (Address: ${addressMapping.address}), but there was an error encountered => ${error}. This message has been queued`
            if(queue.noOfAttempts === 0) {
                await models.Logs.create({level: 'WARNING', log: queueLog, QueueId: queue.id})
            }
            await queue.update({
                sendDetails: queueLog,
                noOfAttempts: `${queue.noOfAttempts+1}`
            })
        })     
    } else {
        try{
            const response = await messageDispatcher.sendHTTP(addressMapping.address, JSON.stringify(payload))
            if(response.ok) {
                let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) sent to ${entity.name} successfully! Total send attempts: ${queue.noOfAttempts+1}.`
                const statsChanges = [
                    {name: 'SENT', increment: true},
                    {name: 'QUEUED', increment: false}
                ]
                await Promise.all([
                    models.Logs.create({level: 'INFO', log: sentLog, QueueId: queue.id}),
                    queue.update({ status: 'SENT', sendDetails: sentLog, noOfAttempts: `${queue.noOfAttempts+1}` }),
                    updateNumericStats(statsChanges)
                ])
            } else {
                throw response
            }
        } catch(error) {
            let queueLog = `An attempt was made to send ${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) to ${entity.name} (Address: ${addressMapping.address}), but there was an error encountered => ${error.message}. This message has been queued`
            if(queue.noOfAttempts === 0) {
                await models.Logs.create({ level: 'WARNING', log: queueLog, QueueId: queue.id })
            }
            await queue.update({
                sendDetails: queueLog,
                noOfAttempts: `${queue.noOfAttempts+1}`
            })
        }
    }
}