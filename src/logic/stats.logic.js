import models from '../models'
import ping from 'ping'
import { setInterval } from 'timers';
import { error } from 'util';
import { logger } from '../utils/logger.utils';

export const getActiveEntities = async () => {
    let addresses = []
    try{
        let entities = await models.Entity.findAll()
        for(let entity of entities){
            const addressMapping = await models.AddressMapping.findAll({
                where: {
                    EntityId: entity.id
                }
            })
            if(!addressMapping.length) continue
            addresses.push({name: entity.name, address: addressMapping[0].dataValues.address})
        }
    } catch(error) {
        logger.error(`Error while getting active entities: ${error}`)
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
        .catch(error => logger.error(`Error while updating the entity status: ${error}`))
    }
}

export const updateMsgStats = async (status) => {
    const totalQueued = await totalCounts(status)
    await models.Stats.update({ value: totalQueued.count }, { where: { name: status } })     
}

const totalCounts = async (status) => await models.Queue.findAndCountAll({
    where: { status }
})

export const updateNumericStats = async (statsChanges) => {
    for(let statsChange of statsChanges) {
        const {name, increment} = statsChange
        increment
            ? await models.Stats.update({ value: models.sequelize.literal('value + 1') }, { where: { name } })
            : await models.Stats.update({ value: models.sequelize.literal('value - 1') }, { where: { name } })
    }   
}

export const checkSystemsStatus = () => {
    setInterval(async () => {
        try{
            await updateEntitiesStatus()
        } catch(error){
            logger.error(`Error while checking system status: ${error}`)
        }
    }, 1000*60*5)
}

export const getEntitiesStatus = async () => {
    const stats = await models.Stats.findAll({
        attributes: ['name','value', 'updatedAt']
    })
    return stats
}
