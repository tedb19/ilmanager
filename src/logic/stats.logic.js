import models from '../models'
import { log } from '../utils/log.utils'
import ping from 'ping'
import { CronJob } from 'cron'

const getActiveEntities = async () => {
    let addresses = []
    try{
        let entities = await models.Entity.findAll()
        for(let entity of entities){
            const addressMapping = await entity.getAddressMappings()
            if(!addressMapping.length) continue
            addresses.push({name: entity.name, address: addressMapping[0].dataValues.address})
        }
    } catch(error) {
        log.error(error)
    }
    return addresses
}

export const updateEntitiesStatus = async () => {
    const clients = await getActiveEntities()
    console.log('clients', clients)
    clients.forEach(client => {
        
       ping.sys.probe(client.address.split(':')[0], (isAlive) => {
           const status = isAlive ? 'online' : 'offline'

           models.Stats.update({ value: status }, {
                where: { 
                    name: `${client.name}_STATUS`
                }
          }).then(response => console.log(`${client.name} status updated successfully`))
          .catch(console.log)
       })
    })
}

export const checkSystemsStatus = new CronJob({
    cronTime: '* * * * *',
    onTick: async () => {
        console.log('checking status now...')
        await updateEntitiesStatus()
    },
    start: false,
    timeZone: 'Africa/Nairobi'
})

export const getEntitiesStatus = async () => {
    const clients = await getActiveEntities()
    const stats = await models.Stats.findAll({
        attributes: ['name','value', 'updatedAt']
    })
    return stats
}
