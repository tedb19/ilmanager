import models from '../../models'
import { getActiveEntities } from '../../logic/stats.logic';
/**
 * Convenience methods for accessing the JSON message object
 * 
 */

export const getCCCNumber = (payload) => payload.PATIENT_IDENTIFICATION.INTERNAL_PATIENT_ID.find(identifier => identifier.IDENTIFIER_TYPE == 'CCC_NUMBER') 
export const getRandomIdentifier = (payload) => payload.PATIENT_IDENTIFICATION.INTERNAL_PATIENT_ID[0]
export const getMessageTypeName = (payload) => payload.MESSAGE_HEADER.MESSAGE_TYPE
export const getSendingApplication = (payload) => payload.MESSAGE_HEADER.SENDING_APPLICATION

export const getMsgRecepients = async (entities, sender) => {
    const activeEntities = await getActiveEntities()
    const activeEntityNames = activeEntities.map(activeEntity => activeEntity.name)
    const recepients = entities
        .filter(entity => entity.name !== sender)
        .filter(entity => activeEntityNames.includes(entity.name))
    return recepients
}

export const getDayOfWeek = () => {
	const days = ['SUN','MON','TUE','WED','THUR','FRI','SAT']
	const day = days[ new Date().getDay() ]
	return day
}
