import dateFormat from 'dateformat'
import models from '../../models'

const processDate = dateStr => {
  return dateStr ? dateFormat(new Date(dateStr), 'yyyymmdd') : ''
}

const translateCode = async (type, key) => {
  const labCodes = await models.LabCode.findAll({
    where: { codeKey: key, codeType: type }
  })
  return labCodes.length ? labCodes[0].codeName : ''
}

export const generatePayload = async labResult => {
  const now = new Date()
  const VLMessage = {}

  const sampleRejection = await translateCode(
    'SAMPLE_REJECTION',
    labResult.sampleRejection
  )
  const justification = await translateCode(
    'JUSTIFICATION',
    labResult.justification
  )
  const labTestedIn = await translateCode('LAB', labResult.lab)
  const sampleType = await translateCode('SAMPLE_TYPE', labResult.sampleType)

  VLMessage.MESSAGE_HEADER = {
    SENDING_APPLICATION: 'MLAB SMS APP',
    SENDING_FACILITY: labResult.mflCode,
    RECEIVING_APPLICATION: 'IL',
    RECEIVING_FACILITY: labResult.mflCode,
    MESSAGE_DATETIME: dateFormat(now, 'yyyymmddHHMMss'),
    SECURITY: '',
    MESSAGE_TYPE: 'ORU^VL',
    PROCESSING_ID: 'P'
  }

  VLMessage.PATIENT_IDENTIFICATION = {
    INTERNAL_PATIENT_ID: []
  }

  VLMessage.VIRAL_LOAD_RESULT = []

  const identification = {
    ID: labResult.CCCNumber,
    IDENTIFIER_TYPE: 'CCC_NUMBER',
    ASSIGNING_AUTHORITY: 'CCC'
  }

  const result = {
    DATE_SAMPLE_COLLECTED: processDate(labResult.dateSampleCollected),
    DATE_SAMPLE_TESTED: processDate(labResult.orderDate),
    VL_RESULT: labResult.VLResult,
    SAMPLE_TYPE: sampleType,
    SAMPLE_REJECTION: sampleRejection,
    JUSTIFICATION: justification,
    REGIMEN: '',
    LAB_TESTED_IN: labTestedIn
  }

  VLMessage.PATIENT_IDENTIFICATION.INTERNAL_PATIENT_ID.push(identification)
  VLMessage.VIRAL_LOAD_RESULT.push(result)
  return VLMessage
}
