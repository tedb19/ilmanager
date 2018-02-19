import models from '../models'
import ping from 'ping'
import { setInterval } from 'timers';
import { error } from 'util';

export const getActiveEntities = async () => {
    let addresses = []
    try{
        let entities = await models.Entity.findAll()
        for(let entity of entities){
            const addressMapping = await entity.getAddressMappings()
            if(!addressMapping.length) continue
            addresses.push({name: entity.name, address: addressMapping[0].dataValues.address})
        }
    } catch(error) {
        console.log('active entities', error)
    }
    return addresses
}

export const isLocalAddress = async (client) => client.address.match(/localhost|127.0.0.1/g) ? true : false

export const updateEntitiesStatus = async () => {
    const clients = await getActiveEntities()
    for(let client of clients){
        let status = await isLocalAddress(client) ? 'online' : 'offline'
        if(status === 'offline'){
            ping.sys.probe(client.address.split(':')[0], (isAlive) => {
                status = isAlive ? 'online' : 'offline'
            })
        }
        models.Stats.update({ value: status }, {
            where: {
                name: `${client.name}_STATUS`
            }
        }).then(response => response)
        .catch(error => server.log(['app', 'error'], error))
    }
}

export const checkSystemsStatus = () => {
    setInterval(async () => {
        try{
            await updateEntitiesStatus()
        } catch(error){
            console.log(error)
        }
    }, 1000*60*5)
}

export const getEntitiesStatus = async () => {
    const clients = await getActiveEntities()
    const stats = await models.Stats.findAll({
        attributes: ['name','value', 'updatedAt']
    })
    return stats
}
