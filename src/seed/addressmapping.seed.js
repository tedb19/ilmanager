import models from '../models'

export const seedaddressMappings = () => models.AddressMapping.bulkCreate(addressMappings)

export const addressMappings = [
    {id: 1, protocol: 'TCP', address: '127.0.0.1:9000', status: 'ACTIVE', EntityId: 1},
    {id: 2, protocol: 'HTTP', address: '127.0.0.1:9001', status: 'ACTIVE', EntityId: 2}
]
