import Boom from 'boom'

import models from '../../models'
import { getSubscribedMessageTypes, getMessageTypeObj, getSubscribedEntities, updateStats } from '../../logic/db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from './message.manipulation'
import { messageDispatcher } from './messagedispatcher'
import { updateNumericStats } from '../../logic/stats.logic'

export const processIncoming = async (payload) => {
    const messageTypeName = getMessageTypeName(payload)
    const sendingApplication = getSendingApplication(payload)
    const messageType = await getMessageTypeObj(messageTypeName)
    const entities = await getSubscribedEntities(messageType)
    const msgRecepients = await getMsgRecepients(entities, sendingApplication)
    const CCCNumber = getCCCNumber(payload)
    let receivedMsgLog = ''
    let forwardingMsgLog = ''

    if(CCCNumber) {
        receivedMsgLog = `Received ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) from ${sendingApplication}`
        forwardingMsgLog = `Forwarding ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) from ${sendingApplication} to ${msgRecepients.map(rec => rec.name).join(', ')}`
    } else {
        const randomIdentifier = getRandomIdentifier(payload)
        receivedMsgLog = `Received ${messageType.verboseName.replace(/_/g, ' ')} message (${randomIdentifier.IDENTIFIER_TYPE} : ${randomIdentifier.ID}) from ${sendingApplication} with no CCC number!`
        forwardingMsgLog = `Forwarding  ${messageType.verboseName.replace(/_/g, ' ')} message (${randomIdentifier.IDENTIFIER_TYPE} : ${randomIdentifier.ID}) from ${sendingApplication} to ${msgRecepients.map(rec => rec.name).join(', ')}`
    }

    await Promise.all([
        models.Logs.create({level: 'INFO', log: receivedMsgLog}),
        models.Logs.create({level: 'INFO', log: forwardingMsgLog}),
        updateStats(messageType),
        updateNumericStats([{name: 'RECEIVED', increment: true}])
    ])

    for(let msgRecepient of msgRecepients) {
        await models.Queue.create({
            message: JSON.stringify(payload),
            sendDetails: receivedMsgLog,
            noOfAttempts: 0,
            EntityId: msgRecepient.id
        })
    }       
}