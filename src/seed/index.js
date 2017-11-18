import { seedMessageTypes } from './messagetype.seed'
import { seedEntities } from './entity.seed'
import { seedSubscribers } from './subscriber.seed'
import { seedStats } from './stats.seed'
import { seedaddressMappings } from './addressmapping.seed'
import { seedLabCodes } from './labcode.seed'
import models from '../models'

export const initializeDb = async (options = { force: true }) => {
    let message = {level: '', msg: ''}
    if(options.force){
        try{
            await models.sequelize.sync(options)
            await Promise.all([seedEntities(), seedMessageTypes(), seedStats(), seedLabCodes()])
            await seedSubscribers()
            message.level = 'info'
            message.msg = 'All seed data saved successfully!'
        } catch(error) {
            message.level = 'error'
            message.msg = `Error seeding data: ${error}`
        }
    } else {
        message.level = 'info'
        message.msg = `Data seeding skipped`
    }
    
    return message
}