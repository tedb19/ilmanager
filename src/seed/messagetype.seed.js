import models from '../models'

export const seedMessageTypes = () => models.MessageType.bulkCreate(messageTypes)

const messageTypes = [
    { id: 1, name: 'ADT^A04', verboseName: 'PATIENT_REGISTRATION',  description: 'The patient registration message.'},
    { id: 2, name: 'ADT^A08', verboseName: 'PATIENT_UPDATE',  description: 'An update to the patient demographic details'},
    { id: 3, name: 'RDE^001', verboseName: 'PHARMACY_ORDER',  description: 'Drug prescription message. Also used when cancelling a drug prescription'},
    { id: 4, name: 'RDS^O13', verboseName: 'PHARMACY_DISPENSE',  description: 'Message used when dispensing drugs'},
    { id: 5, name: 'SIU^S12', verboseName: 'APPOINTMENT_SCHEDULING',  description: 'Message used when scheduling appointments. Also used when rescheduling, cancelling an appointment, and showing that an appointment was honored'},
    { id: 6, name: 'ORM^O01', verboseName: 'LAB_ORDER',  description: 'Message used when sending a lab order, e.g. a Viral Load Lab Order'},
    { id: 7, name: 'ORU^R01', verboseName: 'OBSERVATION_RESULT_UNSOLICITED',  description: 'This message is generated for any observation that needs to be shared. It\'s also used to transmit the lab results to the subscribed systems'},
    { id: 8, name: 'MOH731^ADX', verboseName: 'MOH_731_ADX',  description: 'ADX is an international standard for aggregate data exchange. The MOH 731 message contains aggregate level data for reporting to both DHIS and DATIM'},
]