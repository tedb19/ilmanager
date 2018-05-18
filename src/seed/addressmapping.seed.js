import models from '../models'

export const seedaddressMappings = () => models.AddressMapping.bulkCreate(addressMappings)

export const addressMappings = [
  {
    id: 1,
    protocol: 'HTTP',
    address:
      'https://test.hiskenya.org/kenya/api/27/dataValueSets?dataElementIdScheme=code&orgUnitIdScheme=code&importStrategy=CREATE_AND_UPDATE&dryRun=false&datasetAllowsPeriods=true&strictOrganisationUnits=true&strictPeriods=true',
    status: 'ACTIVE',
    EntityId: 8
  }
]

/**
 * TODO: In future, we should provide these addresses as suggestions, but keep the systems INACTIVE until the user manually updates the addresses,
  {
    id: 2,
    protocol: 'HTTP',
    address: 'http://127.0.0.1/IQCare/api/interop/receive',
    status: 'ACTIVE',
    EntityId: 1
  },
  {
    id: 3,
    protocol: 'HTTP',
    address: 'http://127.0.0.1/ADT/tools/api',
    status: 'ACTIVE',
    EntityId: 3
  },
  {
    id: 4,
    protocol: 'HTTP',
    address: 'http://127.0.0.1/hl7_message',
    status: 'ACTIVE',
    EntityId: 4
  }
 */
