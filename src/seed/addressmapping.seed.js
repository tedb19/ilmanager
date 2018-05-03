import models from '../models'

export const seedaddressMappings = () => models.AddressMapping.bulkCreate(addressMappings)

export const addressMappings = [
  { id: 1, protocol: 'HTTP', address: 'https://test.hiskenya.org/kenya', status: 'ACTIVE', EntityId: 8 }
]
