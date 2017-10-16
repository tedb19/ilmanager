import models from '../models'

export const seedEntities = () => models.Entity.bulkCreate(entities)

export const entities = [
    {id: 1, name: 'IQCARE', color: "teal", description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management', status: 'ACTIVE'},
    {id: 2, name: 'KENYAEMR', color: "pink", description: 'The Electronic Medical Record sytem used at the CCC for patients\' CARE management', status: 'INACTIVE'},
    {id: 3, name: 'ADT', color: "violet", description: 'ARV Dispensing Tool used at the CCC\'s pharmacy', status: 'ACTIVE'},
    {id: 4, name: 'T4A', color: "yellow", description: 'The system used to send out appointment reminders to patients', status: 'ACTIVE'},
    {id: 5, name: 'LOCAL_EID', color: "purple", description: 'A locally cached instanse of the EID data, for this facility.', status: 'INACTIVE'},
    {id: 6, name: 'REMOTE_EID', color: "red", description: 'The central EID server hosted @ NASCOP', status: 'INACTIVE'},
    {id: 7, name: 'MPI', color: "orange", description: 'The Master Person Index is a central registry of all the identifiers of a patient. It helps with deduplication', status: 'INACTIVE'},
    {id: 8, name: 'DHIS2', color: "blue", description: 'DHIS 2 lets you manage aggregate data with a flexible data model and advanced visualization features', status: 'INACTIVE'},
    {id: 9, name: 'DATIM', color: "green", description: 'Data for Accountability Transparency Impact Monitoring (DATIM) is a CDC resource for aggregate-level data collection and report sharing ', status: 'INACTIVE'}
]
