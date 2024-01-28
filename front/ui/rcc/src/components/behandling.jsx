import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import OprationsKod from './kirurgi.jsx';
import {createBehandling, Behandling} from './fråga3.mjs';
import update from 'immutability-helper';
import "react-datepicker/dist/react-datepicker.css";


function getBehandlingOptions(){

    return Object.values(Behandling).map(
        (behandling, i) => <option key={i} value={behandling}>{behandling}</option>);

}

function filterCodes(codes, disableCodes){

    return disableCodes ? []: codes.filter(Boolean);
}

function save(patient, setPatienter, typ, date, codes, diableCodes){

    let filteredCodescodes = filterCodes(codes, diableCodes);

    let updateAndSave = (deepcopy) => {
        window.inca.patienter = deepcopy();
        return(deepcopy());
    };

    let behandling = createBehandling(date.toDateString(), typ, filteredCodescodes);
    
    setPatienter(prev => updateAndSave(() => update(prev, {[patient]: {behandlingar: {$push: [behandling]}}})));
}


function BehandlingForm(patient, setPatienter, startDate = new Date(), oldBehandling = Behandling.CYTO) {

    const [date, setDate] = useState(startDate);
    const [behandling, setBehandling] = useState(oldBehandling);
    const [disableCodes, setDisableCodes] = useState(behandling !== Behandling.KIRURGI);
    const [validated, setValidated] = useState(false);
    const [codes, setCodes] = useState([]);
    const [disableSave, setSave] = useState(false);
    

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      if (form.checkValidity() === false) {
        event.stopPropagation();
      }else{
        save(patient, setPatienter, behandling, date, codes, disableCodes);
        setSave(true);
      }
  
      setValidated(true);
    };

    const toggleSave = (save) => {setValidated(false);setSave(false);};

    // reset form when patient changes
    useEffect(() => {
        toggleSave(false);
    },[patient]);

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBehandlingTyp">
                
            <Form.Group className="mb-3" controlId="formBehandlingDate">
                <Form.Label>Datum för behandling:</Form.Label>
                <br/>
                <DatePicker selected={date} onChange={(newdate) => {setDate(newdate); toggleSave(false);}} />
            </Form.Group>

            <Form.Label>Typ av behandling:</Form.Label>
                <Form.Select value={behandling} onChange={e => {
                        setBehandling(e.currentTarget.value);
                        setDisableCodes(e.currentTarget.value !== Behandling.KIRURGI);
                        toggleSave(false);
                        }}>
                    {getBehandlingOptions()}
                </Form.Select>
            </Form.Group>

            {OprationsKod(codes, setCodes, ()=> toggleSave(false) , disableCodes)}

            <Form.Group className="mb-3" controlId="formBehandlingSave">
                <Button disabled={disableSave} type="submit" variant="outline-success"> Save </Button>
            </Form.Group>
        </Form>
    );
           
}

export default BehandlingForm;
