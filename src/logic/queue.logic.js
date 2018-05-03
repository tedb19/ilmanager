import models from '../models'
import { getMessageTypeObj } from './db.manipulation'
import { getMessageTypeName, getRandomIdentifier, getCCCNumber } from '../routes/DAD/message.manipulation'
import { messageDispatcher } from '../routes/DAD/messagedispatcher'
import { updateNumericStats, updateMsgStats } from './stats.logic'
import { logger } from '../utils/logger.utils'

export const queueManager = () => {
  setInterval(async () => {
    try {
      await processAllQueued()
    } catch (error) {
      logger.error(error)
    }
  }, 1000 * 10)
}

export const QueuePruner = () => {
  setInterval(async () => {
    try {
      await pruneQueue()
    } catch (error) {
      logger.error(error)
    }
  }, 60000 * 60 * 24)
}
// TODO: prune queue
const pruneQueue = async () => {
  await models.Queue.destroy({
    where: {
      status: 'SENT'
    }
  })
}

export const updateLog = async (queue, level, log) => {
  const logs = await models.Logs.findAll({ where: { QueueId: queue.id } })
  const updatedLog = {
    log,
    level,
    QueueId: queue.id
  }

  logs.length
    ? await models.Logs.update(updatedLog, { where: { QueueId: queue.id } })
    : await models.Logs.create(updatedLog)
}

export const processAllQueued = async () => {
  const queuedMessages = await models.Queue.findAll({ where: { status: 'QUEUED' } })
  for (let queuedMessage of queuedMessages) {
    await processQueued(queuedMessage)
  }
  await updateMsgStats('QUEUED')
  await updateMsgStats('SENT')
}

export const processQueued = async (queue) => {
  if (queue.type === 'JSON') {
    const payload = JSON.parse(queue.message)
    const messageTypeName = getMessageTypeName(payload)
    const [messageType, entity] = await Promise.all([
      getMessageTypeObj(messageTypeName),
      models.Entity.findById(queue.EntityId)
    ])
    const [addressMapping] = await models.AddressMapping.findAll({ where: { EntityId: entity.id } })
    const CCCNumber = getCCCNumber(payload)

    let identifier = {}
    if (CCCNumber) {
      identifier.IDENTIFIER_TYPE = CCCNumber.IDENTIFIER_TYPE
      identifier.ID = CCCNumber.ID
    } else {
      const randomIdentifier = getRandomIdentifier(payload)
      identifier.IDENTIFIER_TYPE = randomIdentifier.IDENTIFIER_TYPE
      identifier.ID = randomIdentifier.ID
    }

    if (addressMapping.protocol === 'TCP') {
      const client = await messageDispatcher.sendTCP(addressMapping.address, JSON.stringify(payload))

      client.on('data', async (data) => {
        let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) sent to ${entity.name} successfully! Total send attempts: ${queue.noOfAttempts + 1}.`
        const statsChanges = [
          { name: 'SENT', increment: true },
          { name: 'QUEUED', increment: false }
        ]
        await Promise.all([
          queue.update({ status: 'SENT', sendDetails: sentLog, noOfAttempts: `${queue.noOfAttempts + 1}` }),
          updateNumericStats(statsChanges),
          updateLog(queue, 'INFO', sentLog)
        ])
        client.end()
        client.destroy()
      })

      client.on('error', async (error) => {
        let queueLog = `An attempt was made to send ${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) to ${entity.name} (Address: ${addressMapping.address}), 
            but there was an error encountered => ${error}. This message has been queued.`

        if (queue.noOfAttempts === 0) await updateLog(queue, 'WARNING', queueLog)

        await queue.update({
          sendDetails: queueLog,
          noOfAttempts: `${queue.noOfAttempts + 1}`
        })
        client.end()
        client.destroy()
      })
    } else {
      try {
        const response = await messageDispatcher.sendHTTP(addressMapping.address, JSON.stringify(payload))
        response.text().catch(console.error)
        if (response.ok) {
          let sentLog = `${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) sent to ${entity.name} successfully! Total send attempts: ${queue.noOfAttempts + 1}.`
          const statsChanges = [
            { name: 'SENT', increment: true },
            { name: 'QUEUED', increment: false }
          ]
          await Promise.all([
            queue.update({ status: 'SENT', sendDetails: sentLog, noOfAttempts: `${queue.noOfAttempts + 1}` }),
            updateNumericStats(statsChanges),
            updateLog(queue, 'INFO', sentLog)
          ])
        } else {
          throw response
        }
      } catch (error) {
        let queueLog = `An attempt was made to send ${messageType.verboseName.replace(/_/g, ' ')} message (${identifier.IDENTIFIER_TYPE} : ${identifier.ID}) to ${entity.name} (Address: ${addressMapping.address}), but there was an error encountered => ${error.message}. This message has been queued`

        if (queue.noOfAttempts === 0) await updateLog(queue, 'WARNING', queueLog)

        await queue.update({
          sendDetails: queueLog,
          noOfAttempts: `${queue.noOfAttempts + 1}`
        })
      }
    }
  } else {
    try {
      const [dhisUsername] = await models.Settings.findAll({ where: { description: 'DHIS2 Username' } })
      const [dhisPassword] = await models.Settings.findAll({ where: { description: 'DHIS2 Password' } })
      const [entity] = await models.Entity.findAll({ where: { name: 'DHIS2' } })
      const [address] = await models.AddressMapping.findAll({ where: { EntityId: entity.id } })
      let user = { username: dhisUsername.dataValues.value, password: dhisPassword.dataValues.value }
      const response = await messageDispatcher.sendToDHIS2(address.address, queue.message, user)
      response.text().catch(console.error)
      if (response.ok) {
        let sentLog = `MOH 731 ADX message sent to ${entity.name} successfully! Total send attempts: ${queue.noOfAttempts + 1}.`
        const statsChanges = [
          { name: 'SENT', increment: true },
          { name: 'QUEUED', increment: false }
        ]
        await Promise.all([
          queue.update({ status: 'SENT', sendDetails: sentLog, noOfAttempts: `${queue.noOfAttempts + 1}` }),
          updateNumericStats(statsChanges),
          updateLog(queue, 'INFO', sentLog)
        ])
      } else {
        throw response
      }
    } catch (error) {
      const [entity] = await models.Entity.findAll({ where: { name: 'DHIS2' } })
      const [address] = await models.AddressMapping.findAll({ where: { EntityId: entity.id } })
      let queueLog = `An attempt was made to send MOH 731 ADX message to ${entity.name} (Address: ${address.address}), but there was an error encountered => ${JSON.stringify(error)}. This message has been queued`

      if (queue.noOfAttempts === 0) await updateLog(queue, 'WARNING', queueLog)

      await queue.update({
        sendDetails: queueLog,
        noOfAttempts: `${queue.noOfAttempts + 1}`
      })
    }
  }
}
