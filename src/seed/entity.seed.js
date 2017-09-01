import models from '../models'

export const seedEntities = () => models.Entity.bulkCreate(entities)

export const entities = [
    {id: 1, name: 'IQCARE', color: "teal", address: '127.0.0.1:11000', description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management'},
    {id: 2, name: 'KENYAEMR', color: "pink", address: null, description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management'},
    {id: 3, name: 'ADT', color: "violet", address: '127.0.0.1:11001', description: 'ARV Dispensing Tool used at the CCC\'s pharmacy'},
    {id: 4, name: 'T4A', color: "yellow", address: '127.0.0.1:11002', description: 'The system used to send out appointment reminders to patients'},
    {id: 5, name: 'LOCAL_EID', color: "purple", address: null, description: 'A locally cached instanse of the EID data, for this facility.'},
    {id: 6, name: 'REMOTE_EID', color: "green", address: null, description: 'The central EID server hosted @ NASCOP'},
    {id: 7, name: 'MPI', color: "orange", address: null, description: 'The Master Person Index is a central registry of all the identifiers of a patient. It helps with deduplication'}
]
