import { seedMessageTypes } from './messagetype.seed'
import { seedEntities } from './entity.seed'
import { seedSubscribers } from './subscriber.seed'
import { seedStats } from './stats.seed'
import { seedLabCodes } from './labcode.seed'
import { seedSettings } from './settings.seed'
import { seedaddressMappings } from './addressmapping.seed'

import models from '../models'

export const initializeDb = async (options = { force: false }) => {
  let message = { level: '', msg: '' }
  try {
    await models.sequelize.sync(options)
    const totalEntities = await models.Entity.count()

    if (parseInt(totalEntities, 2)) {
      message.level = 'info'
      message.msg = `Data seeding skipped`
    } else {
      await Promise.all([seedEntities(), seedMessageTypes(), seedStats(), seedLabCodes(), seedSettings()])
      await Promise.all([seedSubscribers(), seedaddressMappings()])
      message.level = 'info'
      message.msg = 'All seed data saved successfully!'
    }
  } catch (error) {
    message.level = 'error'
    message.msg = `Error seeding data: ${error}`
  }
  return message
}
