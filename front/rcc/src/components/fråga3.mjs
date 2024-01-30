
/*
const IncaObject = {

    patienter // Array av patient objekt
};

const Patient = {
    personNr, 
    diagnoser, // Array av diagnos objekt
    behandlingar, // Array av behandling objekt
    alltillsånd // Array av tillsånd objekt
};

const diagnos = {
    diagnosgrund, // PAD, cytologi, röntgen, klinisk
    datum
};

const tillsånd = {
    datum,
    ecog // 0-5
};

const behandling = {
    typ,    // cytostatikabehandling, strålbehandling, kirurgi
    datum,
    oprationskoder // Array av oprationskoder
};

*/

export const DiagnosGrund = {
    PAD: 'PAD',
    CYTOLOGI: 'cytologi',
    RÖNTGEN: 'röntgen',
    KLINISK: 'klinisk'
};

export const Behandling = {
    CYTO: 'cytostatikabehandling',
    STRÅL: 'strålbehandling',
    KIRURGI: 'kirurgi'
};


window.inca = createIncaObject();


function createIncaObject(patienterList = []){
    const IncaObject = {
        patienter: patienterList 
    }; 

    return IncaObject;
}

export function createPatient(personNr, diagnoser = [], behandlingar = [], alltillsånd = []){
    const Patient = {
        personNr: personNr, 
        diagnoser: diagnoser, 
        behandlingar: behandlingar,
        alltillsånd: alltillsånd 
    };

    return Patient;
}

export function createDiagnos(datum, diagnosgrund){
    const diagnos = {
        diagnosgrund: diagnosgrund,
        datum: datum
    };

    return diagnos;
}

export function createTillsånd(datum, ecog){
    const tillsånd = {
        datum: datum,
        ecog: ecog
    };

    return tillsånd;
}

export function createBehandling(datum, typ, oprationskoder = []){
    
    oprationskoder = typ === Behandling.KIRURGI ? oprationskoder : [];
     
    const behandling = {
        typ: typ,
        datum: datum,
        oprationskoder: oprationskoder
    };

    return behandling;
}

export function tryAddPatient(patient, setPatienter){
    if(patient  !== undefined ){
        setPatienter(prev => prev.some(p => p.personNr === patient.personNr) ? prev:[...prev, patient]);
    }
}


