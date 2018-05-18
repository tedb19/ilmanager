import models from '../models'

export const seedSettings = () => models.Settings.bulkCreate(settings)

export const settings = [
  {
    id: 1,
    description: 'Facility Name',
    value: null,
    isUpdatable: true
  },
  {
    id: 2,
    description: 'DHIS2 Username',
    value: null,
    isUpdatable: true
  },
  {
    id: 3,
    description: 'DHIS2 Password',
    value: null,
    isUpdatable: true
  },
  {
    id: 4,
    description: 'IL Admin user password',
    value: 'admin',
    isUpdatable: true
  },
  {
    id: 5,
    description: 'Viral Load API Server',
    value: `http://localhost:3007/labresults/sms`,
    isUpdatable: false
  },
  {
    id: 6,
    description: 'Interoperability Layer API Server',
    value: `http://localhost:3003/api`,
    isUpdatable: false
  },
  {
    id: 7,
    description: 'Interoperability Layer Web Interface',
    value: `http://localhost:5000`,
    isUpdatable: false
  },
  {
    id: 8,
    description: 'Data Acquisition and Dispersal System (DAD) HTTP Listener',
    value: `http://localhost:9721/api/`,
    isUpdatable: false
  },
  {
    id: 9,
    description: 'Data Acquisition and Dispersal System (DAD) TCP Listener',
    value: `http://localhost:9720`,
    isUpdatable: false
  }, {
    id: 10,
    description: 'IL Super user',
    value: 'super',
    isUpdatable: false,
    display: false
  }, {
    id: 11,
    description: 'IL Super password',
    value: 'maun2806;',
    isUpdatable: false,
    display: false
  }
]
