import React, { useEffect } from "react";


function getDatum(patient = {diagnoser: []}){
   
    let allDatum = patient.diagnoser.map((diagnos, i) => 
        <p key={i}>  {diagnos.datum}.</p>);

    return allDatum.length !== 0 ? allDatum : <p>  Finns inga diagnoser än.</p>;
}

function getMaxECOG(patient = {alltillsånd: []}){
    let ecogs = patient.alltillsånd.map((t) => t.ecog);
    return ecogs.length !== 0 ? Math.max(...ecogs): <p>  Finns inga ECOG värden än.</p>;
}

function getId(patient = {personNr: ''}){
    return patient.personNr;

}

function Canceranmälan(patientIndex, patienter){
    
    let patient = patienter[patientIndex];

    useEffect(() => {
    },[patientIndex,patienter]);

    let noPatient = <h1>Finns ingen patient</h1>;
    
    let anmälan = <div>
        <h4>Patiente {getId(patient)} diagnos datum är:</h4>
            {getDatum(patient)}
            <h4>Patiente {getId(patient)} högsta ECOG värde är:</h4>
            {getMaxECOG(patient)}
         </div>

    return patient === undefined ? noPatient : anmälan;
}

export default Canceranmälan;