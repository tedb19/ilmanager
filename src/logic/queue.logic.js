import models from '../models'
import { getSubscribedMessageTypes, getMessageTypeObj, getSubscribedEntities } from './db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from '../routes/DAD/message.manipulation'
import { messageDispatcher } from '../routes/DAD/messagedispatcher'
import { updateNumericStats } from './stats.logic';

export const processAllQueued = async () => {
    const queuedMessages = await models.Queue.findAll({ where: { status: 'QUEUED' }})
    for(let queuedMessage of queuedMessages) {
        await processQueued(queuedMessage)
    }
}

export const queueManager = () => {
    setInterval(async () => {
        try{
            await processAllQueued()
        } catch(error){
            console.log(error)
        }
    }, 2000)
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

    if(CCCNumber) {
        forwardingMsgLog = 
            `Resending ${messageType.verboseName.replace(/_/g, ' ')} message 
            (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) from ${sendingApplication} to ${entity.name}. 
            Total send attempts are now ${queue.noOfAttempts}`
    } else {
        const randomIdentifier = getRandomIdentifier(payload)
        forwardingMsgLog = 
            `Resending ${messageType.verboseName.replace(/_/g, ' ')} message 
            (${randomIdentifier.IDENTIFIER_TYPE} : ${randomIdentifier.ID}) from ${sendingApplication} to ${entity.name}. 
            Total send attempts are now ${queue.noOfAttempts}`
    }
    if(queue.noOfAttempts > 1) {
        await models.Logs.create({level: 'INFO', log: forwardingMsgLog})
    }
    
    try{
        if(addressMapping.protocol === 'TCP') {
            const client = await messageDispatcher.sendTCP(addressMapping.address, JSON.stringify(payload))

            client.on('data', async (data) => {
                let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) sent to ${entity.name} successfully!`
                const statsChanges = [
                    {name: 'SENT', increment: true},
                    {name: 'QUEUED', increment: false}
                ]
                await Promise.all([
                    models.Logs.create({level: 'INFO', log: sentLog}),
                    queue.update({ status: 'SENT', sendDetails: sentLog }),
                    updateNumericStats(statsChanges)
                ])
            })

            client.on('error', async (error) => {
                let queueLog = `An attempt was made to send a ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) to ${entity.name} (Address: ${addressMapping.address}), but there was an error encountered => ${error}. This message has been queued`
                await Promise.all([
                    models.Logs.create({level: 'WARNING', log: queueLog}),
                    queue.update({
                        sendDetails: queueLog,
                        noOfAttempts: `${queue.noOfAttempts+1}`
                    })
                ])
            })            
        } else {
            const response = await messageDispatcher.sendHTTP(addressMapping.address, JSON.stringify(payload))
            if(response.ok) {
                let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) sent to ${entity.name} successfully!`
                const statsChanges = [
                    {name: 'SENT', increment: true},
                    {name: 'QUEUED', increment: false}
                ]
                await Promise.all([
                    models.Logs.create({level: 'INFO', log: sentLog}),
                    queue.update({ status: 'SENT', sendDetails: sentLog }),
                    updateNumericStats(statsChanges)
                ])
            } else {
                let queueLog = `An attempt was made to send a ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) to ${entity.name} (Address: ${addressMapping.address}), but the system was offline. IL will keep trying to reach this system. If this persists, please check your network`
                await Promise.all([
                    models.Logs.create({level: 'WARNING', log: queueLog}),
                    queue.update({
                        sendDetails: queueLog,
                        noOfAttempts: `${queue.noOfAttempts+1}`
                    })
                ])
            }
        }                  
    } catch(error) {
        //save to queue
        let queueLog = `An attempt was made to send a ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) to ${entity.name} (Address: ${addressMapping.address}), but there was an error encountered => ${error}. This message has been queued`
        await Promise.all([
            models.Logs.create({level: 'WARNING', log: queueLog}),
            queue.update({
                sendDetails: queueLog,
                noOfAttempts: `${queue.noOfAttempts+1}`
            })
        ])
    }
}