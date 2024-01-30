import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormTabs from './tabs.jsx';
import {createPatient,tryAddPatient} from './fråga3.mjs';


function handleNyPatient(personnummer, setPatienter){
 
  let nyPatient = createPatient(personnummer);
  tryAddPatient(nyPatient, setPatienter);

}


function getPatientOptions(patienter){
  return patienter.map(
      (p,i) => <option key={i}  value={i}> {p.personNr} </option>);

}

function isEmpty (array){
  return array === undefined || array.length === 0;
}

function getContent(patient, patienter, setPatienter){

  let tabs = FormTabs(patient, patienter, setPatienter);

  if(noPationsExist){
    return <h1>Lägg till en patient</h1>
  }else{
    return tabs;
  }

}

function getPersonNummerRegex(){
  let day = "(0[1-9]|[12]\\d|3[01])"; //0-31
  let month = "(0[1-9]|1[0-2])"; //0-12
  let year = "\\d{4}";
  let dash = "[\\-]{1}";
  return year + month + day + dash + "\\d{4}";
}

let noPationsExist = true;

function PatientForm() {

  const [patienter, setPatienter] = useState([]); 
  const [patientIndex, setPatientIndex] = useState(0); 
  const [validated, setValidated] = useState(false);
  

  const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      if (form.checkValidity() === false) {
        event.stopPropagation();
      }else{
        handleNyPatient(form.inputPersonnummer.value, setPatienter);
      }
      
      setValidated(true);
  };

  noPationsExist = isEmpty(patienter);
 

  return(
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Label>Lägg till ny Patient:</Form.Label>

        <InputGroup hasValidation className="mb-3">
          <Form.Control required pattern = {getPersonNummerRegex()} maxLength={13}  
                        type="input" placeholder="ååååmmdd-xxxx" 
                        id="inputPersonnummer"
                        onChange={(e) => {setValidated(false)}}/>
       
          <Button type="submit" variant="outline-success" id="button-addon">Lägg till </Button>

          <Form.Control.Feedback type="invalid">
                Please provide a valid personnummer(ååååmmdd-xxxx).
          </Form.Control.Feedback>
        </InputGroup>
      </Form>

      <Form>
        <Form.Label>Välj Patient:</Form.Label>
        <Form.Select disabled={noPationsExist} 
          onChange={e => {setPatientIndex(e.currentTarget.value);}}>
                    {getPatientOptions(patienter)}
        </Form.Select>
      </Form>
      <br/>
      {getContent(patientIndex, patienter, setPatienter)}
      
    </div>
  );
}

export default PatientForm;