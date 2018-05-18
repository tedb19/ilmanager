export const getCCCNumber = payload =>
  payload.PATIENT_IDENTIFICATION.INTERNAL_PATIENT_ID.find(
    identifier => identifier.IDENTIFIER_TYPE === 'CCC_NUMBER'
  )
export const getRandomIdentifier = payload =>
  payload.PATIENT_IDENTIFICATION.INTERNAL_PATIENT_ID[0]

export const getMessageTypeName = payload => payload.MESSAGE_HEADER.MESSAGE_TYPE

export const getSendingApplication = payload =>
  payload.MESSAGE_HEADER.SENDING_APPLICATION
