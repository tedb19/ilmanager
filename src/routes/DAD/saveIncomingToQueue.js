import models from '../../models'
import { getMessageTypeObj, getSubscribedEntities, updateStats } from '../../logic/db.manipulation'
import { getMessageTypeName, getSendingApplication, getRandomIdentifier, getMsgRecepients, getCCCNumber } from './message.manipulation'
import { updateNumericStats, updateMsgStats } from '../../logic/stats.logic'
import { logger } from '../../utils/logger.utils'

export const savePayload = async (payload) => {
  let response = ''
  try {
    const parsedPayload = JSON.parse(payload)
    const identifier = getCCCNumber(parsedPayload)
    if (identifier && identifier.ID) {
      await saveJSONToQueue(parsedPayload)
      response = JSON.stringify({ msg: 'successfully received by the Interoperability Layer (IL)' })
    } else {
      response = JSON.stringify({ msg: 'No CCC Number specified! This message will not be shared with the systems as it does not follow the standard!' })
    }
  } catch (error) {
    logger.error(`Error while saving payload: ${error}`)
  }
  return response
}

export const saveJSONToQueue = async (payload) => {
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
    models.Logs.create({ level: 'INFO', log: receivedMsgLog }),
    updateStats(messageType),
    updateNumericStats([{ name: 'RECEIVED', increment: true }])
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

export const saveXMLToQueue = async (payload) => {
  const messageTypeName = 'MOH731^ADX'
  try {
    const messageType = await getMessageTypeObj(messageTypeName)
    const entities = await getSubscribedEntities(messageType)
    const receivedMsgLog = `Received ADX message successfully. Subscribers include ${entities.map(entity => entity.name).join(',')}`

    await Promise.all([
      models.Logs.create({ level: 'INFO', log: receivedMsgLog }),
      updateStats(messageType),
      updateNumericStats([{ name: 'RECEIVED', increment: true }])
    ])

    for (const entity of entities) {
      await models.Queue.create({
        message: payload,
        sendDetails: receivedMsgLog,
        noOfAttempts: 0,
        EntityId: entity.id,
        status: 'QUEUED',
        type: 'XML'
      })
    }

    await updateMsgStats('QUEUED')
    await updateMsgStats('SENT')
  } catch (error) {
    logger.error(error)
  }
}
