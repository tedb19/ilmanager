import { seedMessageTypes } from './messagetype.seed'
import { seedEntities } from './entity.seed'
import { seedSubscribers } from './subscriber.seed'
import { seedStats } from './stats.seed'
import { seedaddressMappings } from './addressmapping.seed'
import { log } from '../utils/log.utils'
import models from '../models'

export const initializeDb = async (options = { force: true }) => {
    return await models
            .sequelize
            .sync(options)
            .then(() => Promise.all([seedEntities(), seedMessageTypes(), seedStats(), seedaddressMappings()]))
            .then(() => seedSubscribers())
            .then(() => log.info('All seed data uploaded...'))
            .catch(error => log.error(error))
}