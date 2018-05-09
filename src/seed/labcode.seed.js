import models from '../models'

export const seedLabCodes = () => models.LabCode.bulkCreate(labCodes)

export const labCodes = [
  // SAMPLE_TYPE
  {id: '1', codeType: 'SAMPLE_TYPE', codeKey: '1', codeName: 'Frozen plasma'},
  {id: '2', codeType: 'SAMPLE_TYPE', codeKey: '2', codeName: 'Venous blood (EDTA)'},
  {id: '3', codeType: 'SAMPLE_TYPE', codeKey: '3', codeName: 'DBS capillary (infants only)'},
  {id: '4', codeType: 'SAMPLE_TYPE', codeKey: '4', codeName: 'DBS venous'},
  {id: '5', codeType: 'SAMPLE_TYPE', codeKey: '5', codeName: 'PPT'},

  // JUSTIFICATION
  {id: '6', codeType: 'JUSTIFICATION', codeKey: '1', codeName: 'Routine VL'},
  {id: '7', codeType: 'JUSTIFICATION', codeKey: '2', codeName: 'confirmation of treatment failure (repeat VL)'},
  {id: '8', codeType: 'JUSTIFICATION', codeKey: '3', codeName: 'Clinical failure'},
  {id: '9', codeType: 'JUSTIFICATION', codeKey: '4', codeName: 'Single drug substitution'},
  {id: '10', codeType: 'JUSTIFICATION', codeKey: '5', codeName: 'Baseline VL (for infants diagnosed through EID)'},

  // SAMPLE_REJECTION
  {id: '11', codeType: 'SAMPLE_REJECTION', codeKey: '1', codeName: 'Improper collection'},
  {id: '12', codeType: 'SAMPLE_REJECTION', codeKey: '2', codeName: 'Incorrect container'},
  {id: '13', codeType: 'SAMPLE_REJECTION', codeKey: '3', codeName: 'Missing patient ID'},
  {id: '14', codeType: 'SAMPLE_REJECTION', codeKey: '4', codeName: 'Sample request & sample mismatch'},
  {id: '15', codeType: 'SAMPLE_REJECTION', codeKey: '5', codeName: 'Delayed delivery'},
  {id: '16', codeType: 'SAMPLE_REJECTION', codeKey: '6', codeName: 'Serum ring'},
  {id: '17', codeType: 'SAMPLE_REJECTION', codeKey: '7', codeName: 'Expired filter paper/tubes'},
  {id: '18', codeType: 'SAMPLE_REJECTION', codeKey: '8', codeName: 'Specimen processing delay'},
  {id: '19', codeType: 'SAMPLE_REJECTION', codeKey: '9', codeName: 'No requisition form'},
  {id: '20', codeType: 'SAMPLE_REJECTION', codeKey: '10', codeName: 'Improper packaging'},
  {id: '21', codeType: 'SAMPLE_REJECTION', codeKey: '11', codeName: 'Improper drying/shipment'},
  {id: '22', codeType: 'SAMPLE_REJECTION', codeKey: '12', codeName: 'Insufficient volume'},
  {id: '23', codeType: 'SAMPLE_REJECTION', codeKey: '13', codeName: 'poor collected DBS'},
  {id: '24', codeType: 'SAMPLE_REJECTION', codeKey: '14', codeName: 'Other (sample missing,e.t.c)'},

  // LABS
  {id: '25', codeType: 'LAB', codeKey: '1', codeName: 'KEMRI CVR HIV-P3 Lab, Nairobi'},
  {id: '26', codeType: 'LAB', codeKey: '2', codeName: 'KEMRI CDC HIV/R Lab, Kisumu'},
  {id: '27', codeType: 'LAB', codeKey: '3', codeName: 'KEMRI ALUPE HIV Laboratory'},
  {id: '28', codeType: 'LAB', codeKey: '4', codeName: 'KEMRI/Walter Reed CRC Lab, Kericho'},
  {id: '29', codeType: 'LAB', codeKey: '5', codeName: 'AMPATH Care Lab, Eldoret'},
  {id: '30', codeType: 'LAB', codeKey: '6', codeName: 'Coast Provincial General Hospital Molecular Lab'},
  {id: '31', codeType: 'LAB', codeKey: '7', codeName: 'National HIV Reference Laboratory, Nairobi'},
  {id: '32', codeType: 'LAB', codeKey: '8', codeName: 'Nyumbani Diagnostic Lab'},
  {id: '33', codeType: 'LAB', codeKey: '9', codeName: 'Kenyatta National Hospial Lab, Nairobi'}
]
