import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {createTillsånd} from './fråga3.mjs';
import update from 'immutability-helper';

import "react-datepicker/dist/react-datepicker.css";



function radioRange(start, end, setRadioValue, selected, DoOnChange){
    let buttons = []
    
    for(let i = start; i <= end; i++){
        buttons.push(<Form.Check inline label={i} 
            name="group1" type="radio" id={`inline-radio-${i}`}
            value={i}
            key={i}
            defaultChecked={i === selected}
            onChange={e => {setRadioValue(e.currentTarget.value);
                            DoOnChange();}} />)
    }

    return buttons;
}

function save(patient, setPatienter, ecog, date){

    let updateAndSave = (upp) => {
        window.inca.patienter = upp();
        return(upp());
    };

    let tillStånd = createTillsånd(date.toDateString(), ecog);
    
    setPatienter(prev => updateAndSave(() => update(prev, {[patient]: {alltillsånd: {$push: [tillStånd]}}})));
   
}

function TillståndForm(patient, setPatienter, startDate = new Date(), Oldecog = 0) {

    const [date, setDate] = useState(startDate);
    const [ecog, setECOG] = useState(Oldecog);
    const [validated, setValidated] = useState(false);
    const [disableSave, setSave] = useState(false);
            
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
  
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }else{
            save(patient, setPatienter, ecog, date);
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
            
            <Form.Group className="mb-3" controlId="formTillståndDate">
                <Form.Label>Datum för ECOG:</Form.Label>
                <br/>
                <DatePicker selected={date} onChange={(newdate) => {setDate(newdate); toggleSave(false);}} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTillståndRadio">
                <Form.Label>ECOG:</Form.Label>
                <br/>
                {radioRange(0,5,setECOG,ecog,() => toggleSave(false))} 
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTillståndSave">
                <Button disabled={disableSave} type="submit" variant="outline-success">Save</Button>
            </Form.Group>
        </Form>
    );
           
}

export default TillståndForm;
