import models from '../models'

export const seedLabCodes = () => models.LabCode.bulkCreate(labCodes)

export const labCodes = [
    //SAMPLE_TYPE
    {codeType: "SAMPLE_TYPE", codeKey: "1", codeName: "Frozen plasma"},
    {codeType: "SAMPLE_TYPE", codeKey: "2", codeName: "Venous blood (EDTA)"},
    {codeType: "SAMPLE_TYPE", codeKey: "3", codeName: "DBS capillary (infants only)"},
    {codeType: "SAMPLE_TYPE", codeKey: "4", codeName: "DBS venous"},
    {codeType: "SAMPLE_TYPE", codeKey: "5", codeName: "PPT"},

    //JUSTIFICATION
    {codeType: "JUSTIFICATION", codeKey: "1", codeName: "Routine VL"},
    {codeType: "JUSTIFICATION", codeKey: "2", codeName: "confirmation of treatment failure (repeat VL)"},
    {codeType: "JUSTIFICATION", codeKey: "3", codeName: "Clinical failure"},
    {codeType: "JUSTIFICATION", codeKey: "4", codeName: "Single drug substitution"},
    {codeType: "JUSTIFICATION", codeKey: "5", codeName: "Baseline VL (for infants diagnosed through EID)"},

    //SAMPLE_REJECTION
    {codeType: "SAMPLE_REJECTION", codeKey: "1", codeName: "Improper collection"},
    {codeType: "SAMPLE_REJECTION", codeKey: "2", codeName: "Incorrect container"},
    {codeType: "SAMPLE_REJECTION", codeKey: "3", codeName: "Missing patient ID"},
    {codeType: "SAMPLE_REJECTION", codeKey: "4", codeName: "Sample request & sample mismatch"},
    {codeType: "SAMPLE_REJECTION", codeKey: "5", codeName: "Delayed delivery"},
    {codeType: "SAMPLE_REJECTION", codeKey: "6", codeName: "Serum ring"},
    {codeType: "SAMPLE_REJECTION", codeKey: "7", codeName: "Expired filter paper/tubes"},
    {codeType: "SAMPLE_REJECTION", codeKey: "8", codeName: "Specimen processing delay"},
    {codeType: "SAMPLE_REJECTION", codeKey: "9", codeName: "No requisition form"},
    {codeType: "SAMPLE_REJECTION", codeKey: "10", codeName: "Improper packaging"},
    {codeType: "SAMPLE_REJECTION", codeKey: "11", codeName: "Improper drying/shipment"},
    {codeType: "SAMPLE_REJECTION", codeKey: "12", codeName: "Insufficient volume"},
    {codeType: "SAMPLE_REJECTION", codeKey: "13", codeName: "poor collected DBS"},
    {codeType: "SAMPLE_REJECTION", codeKey: "14", codeName: "Other (sample missing,e.t.c)"},

    //LABS
    {codeType: "LAB", codeKey: "1", codeName: "KEMRI CVR HIV-P3 Lab, Nairobi"},
    {codeType: "LAB", codeKey: "2", codeName: "KEMRI CDC HIV/R Lab, Kisumu"},
    {codeType: "LAB", codeKey: "3", codeName: "KEMRI ALUPE HIV Laboratory"},
    {codeType: "LAB", codeKey: "4", codeName: "KEMRI/Walter Reed CRC Lab, Kericho"},
    {codeType: "LAB", codeKey: "5", codeName: "AMPATH Care Lab, Eldoret"},
    {codeType: "LAB", codeKey: "6", codeName: "Coast Provincial General Hospital Molecular Lab"},
    {codeType: "LAB", codeKey: "7", codeName: "National HIV Reference Laboratory, Nairobi"},
    {codeType: "LAB", codeKey: "8", codeName: "Nyumbani Diagnostic Lab"},
    {codeType: "LAB", codeKey: "9", codeName: "Kenyatta National Hospial Lab, Nairobi"}

]
