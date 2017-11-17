import models from '../models'

export const seedStats = () => models.Stats.bulkCreate(stats)

export const stats = [
    /** Messages exchanged per message type */
    {id: 1, name: 'PATIENT_REGISTRATION_MESSAGETYPE', value: '0', description: ''},
    {id: 2, name: 'PATIENT_UPDATE_MESSAGETYPE', value: '0', description: ''},
    {id: 3, name: 'PHARMACY_ORDER_MESSAGETYPE', value: '0', description: ''},
    {id: 4, name: 'PHARMACY_DISPENSE_MESSAGETYPE', value: '0', description: ''},
    {id: 5, name: 'APPOINTMENT_SCHEDULING_MESSAGETYPE', value: '0', description: ''},
    {id: 6, name: 'LAB_ORDER_MESSAGETYPE', value: '0', description: ''},
    {id: 7, name: 'VIRAL_LOAD_RESULT_MESSAGETYPE', value: '0', description: ''},

    /** Message Status */
    {id: 8, name: 'SENT', value: '0', description: ''},
    {id: 9, name: 'QUEUED', value: '0', description: ''},
    {id: 10, name: 'ERRORED', value: '0', description: ''},
    {id: 23, name: 'RECEIVED', value: '0', description: ''},

    /** Entities Online */
    {id: 11, name: 'ADT_STATUS', value: 'offline', description: ''},
    {id: 12, name: 'IQCARE_STATUS', value: 'offline', description: ''},
    {id: 13, name: 'KENYAEMR_STATUS', value: 'offline', description: ''},
    {id: 14, name: 'T4A_STATUS', value: 'offline', description: ''},
    {id: 15, name: 'LOCAL_EID_STATUS', value: 'offline', description: ''},
    {id: 16, name: 'REMOTE_EID_STATUS', value: 'offline', description: ''},
    {id: 17, name: 'MPI_STATUS', value: 'offline', description: ''},

    /** Daily Traffic */
    {id: 18, name: 'MON', value: '0', description: ''},
    {id: 19, name: 'TUE', value: '0', description: ''},
    {id: 20, name: 'WED', value: '0', description: ''},
    {id: 21, name: 'THUR', value: '0', description: ''},
    {id: 22, name: 'FRI', value: '0', description: ''},
    {id: 24, name: 'SUN', value: '0', description: ''},
    {id: 25, name: 'SAT', value: '0', description: ''},
]
