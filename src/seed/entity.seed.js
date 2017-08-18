import models from '../models'

export const seedEntities = () => models.Entity.bulkCreate(entities)

export const entities = [
    {id: 1, name: 'IQCARE', address: null, description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management'},
    {id: 2, name: 'ADT', address: null, description: 'ARV Dispensing Tool used at the CCC\'s pharmacy'},
    {id: 3, name: 'KENYAEMR', address: null, description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management'},
    {id: 4, name: 'T4A', address: null, description: 'The system used to send out appointment reminders to patients'},
    {id: 5, name: 'CACHED_EID', address: null, description: 'A locally cached instanse of the EID data, for this facility.'},
    {id: 6, name: 'REMOTE_EID', address: null, description: 'The central EID server hosted @ NASCOP'}
]