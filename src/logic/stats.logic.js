import models from '../models'
import { log } from '../utils/log.utils'
import ping from 'ping'

const getActiveEntities = async () => {
    const entities = await models.Entity.findAll({ 
        where: { address: { $ne: null} }
    })
    return entities
}

export const updateEntitiesStatus = async () => {
    const clients = await getActiveEntities()
    const addresses = clients.map(client => client.address)

    clients.forEach(client => {
       ping.sys.probe(client.address.split(':')[0], (isAlive) => {
           const status = isAlive ? 'online' : 'offline'

           models.Stats.update({ value: status }, {
                where: { 
                    name: `${client.name}_STATUS`
                }
          }).then(response => console.log(`${client.name} status updated successfully`))
       })
    })
}

export const getEntitiesStatus = async () => {
    await updateEntitiesStatus()
    const clients = await getActiveEntities()
    const clientNames = clients.map(client => `${client.name}_STATUS`)
    const entitiesStatus = await models.Stats.findAll({ 
        where: { name: clientNames },
        attributes: ['name','value', 'updatedAt']
    })
    return entitiesStatus
}
