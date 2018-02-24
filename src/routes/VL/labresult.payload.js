import dateFormat from 'dateformat'
import models from '../../models'
import { processIncoming } from '../DAD/processMessage'

export const VLManager = () => {
    setInterval(async () => {
        try{
            const labResult = await getNewLabResult()
            if(labResult){
                const payload = await generatePayload(labResult)
                await processIncoming(payload)
                await updateLabResult(labResult)
            }
        } catch(error){
            console.log(error)
        }
    }, 1000*60*5)
}

const processDate = (dateStr) => {
    return (dateStr
                ? dateFormat(new Date(dateStr), 'yyyyMMdd')
                : '')
}

const translateCode = async (type, key) => {
    const [labCode] = await models.LabCode.findAll({ where: { codeKey: key, codeType: type }})
    return labCode.codeName
}

export const getNewLabResult = async () => {
    const labResult = await models.LabResult.findOne({
        where: { sent: false }
    })
    return labResult
}

export const updateLabResult = async (labResult) => {
    await labResult.update({
        sent: true 
    })
}

export const generatePayload = async (labResult) => {
    const now = new Date() 
    const VLMessage = {}
    const sampleRejection = await translateCode('SAMPLE_REJECTION', labResult.sampleRejection)
    const justification = await translateCode('JUSTIFICATION', labResult.justification)
    const labTestedIn = await translateCode('LAB', labResult.lab)
    const sampleType = await translateCode('SAMPLE_TYPE', labResult.sampleType)


    VLMessage.MESSAGE_HEADER = {
        SENDING_APPLICATION: 'LOCAL EID CACHE',
        SENDING_FACILITY: labResult.mflCode,
        RECEIVING_APPLICATION: 'IL',
        RECEIVING_FACILITY: labResult.mflCode,
        MESSAGE_DATETIME: dateFormat(now, "yyyyMMddHHmmss"),
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
        DATE_SAMPLE_TESTED: processDate(labResult.dateSampleTested),
        VL_RESULT: labResult.vlresult,
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