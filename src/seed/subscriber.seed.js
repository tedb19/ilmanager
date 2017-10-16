import models from '../models'

export const seedSubscribers  = () => models.Subscriber.bulkCreate(messageSubscribers)

const messageSubscribers = [
    /** IQCARE */
    { EntityId: 1, MessageTypeId: 1},
    { EntityId: 1, MessageTypeId: 2},
    { EntityId: 1, MessageTypeId: 4},
    { EntityId: 1, MessageTypeId: 5},
    { EntityId: 1, MessageTypeId: 6},
    { EntityId: 1, MessageTypeId: 7},

    /** KENYAEMR */
    { EntityId: 2, MessageTypeId: 1},
    { EntityId: 2, MessageTypeId: 2},
    { EntityId: 2, MessageTypeId: 4},
    { EntityId: 2, MessageTypeId: 5},
    { EntityId: 2, MessageTypeId: 6},
    { EntityId: 2, MessageTypeId: 7},

    /** ADT */
    { EntityId: 3, MessageTypeId: 1},
    { EntityId: 3, MessageTypeId: 2},
    { EntityId: 3, MessageTypeId: 3},
    { EntityId: 3, MessageTypeId: 5},
    { EntityId: 3, MessageTypeId: 7},

    /** T4A */
    { EntityId: 4, MessageTypeId: 1},
    { EntityId: 4, MessageTypeId: 2},
    { EntityId: 4, MessageTypeId: 5},

    /** MPI */
    { EntityId: 7, MessageTypeId: 1},
    { EntityId: 7, MessageTypeId: 2},

    /** DHIS2 */
    { EntityId: 8, MessageTypeId: 8},

    /** DATIM */
    { EntityId: 9, MessageTypeId: 8}
]