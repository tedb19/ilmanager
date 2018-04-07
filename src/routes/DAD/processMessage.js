import models from '../../models'
import { getMessageTypeObj, getSubscribedEntities, updateStats } from '../../logic/db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from './message.manipulation'
import { updateNumericStats, updateMsgStats } from '../../logic/stats.logic'

export const saveIncomingToQueue = async (payload) => {
  const messageTypeName = getMessageTypeName(payload)
  const sendingApplication = getSendingApplication(payload)
  const messageType = await getMessageTypeObj(messageTypeName)
  const entities = await getSubscribedEntities(messageType)
  const msgRecepients = await getMsgRecepients(entities, sendingApplication)
  const CCCNumber = getCCCNumber(payload)
  let receivedMsgLog = ''

  let subscriberList = msgRecepients.length ? `Subscribers include ${msgRecepients.map(rec => rec.name).join(', ')}` : `No subscribers listed for this message yet!`
  if (CCCNumber) {
    receivedMsgLog = `Received ${messageType.verboseName.replace(/_/g, ' ')} message (${CCCNumber.IDENTIFIER_TYPE} : ${CCCNumber.ID}) from ${sendingApplication}. ${subscriberList}`
  } else {
    const randomIdentifier = getRandomIdentifier(payload)
    receivedMsgLog = `Received ${messageType.verboseName.replace(/_/g, ' ')} message (${randomIdentifier.IDENTIFIER_TYPE} : ${randomIdentifier.ID}) from ${sendingApplication} with no CCC number! . ${subscriberList}`
  }

  await Promise.all([
    models.Logs.create({level: 'INFO', log: receivedMsgLog}),
    updateStats(messageType),
    updateNumericStats([{name: 'RECEIVED', increment: true}])
  ])

  for (let msgRecepient of msgRecepients) {
    await models.Queue.create({
      message: JSON.stringify(payload),
      sendDetails: receivedMsgLog,
      noOfAttempts: 0,
      EntityId: msgRecepient.id,
      status: 'QUEUED'
    })
  }
  await updateMsgStats('QUEUED')
  await updateMsgStats('SENT')
  return { CCCNumber, msgRecepients }
}
