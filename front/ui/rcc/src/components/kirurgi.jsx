import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';

import "react-datepicker/dist/react-datepicker.css";



function updateList(index, value, setState){

    setState(prev => prev.map((code, i) => {
        if(i === index){
            return value;
        }else{
            return code;
        }
    }));
}

function removeList(index, setState){
 
    setState(prev => prev.filter((code, i) => i !== index));

}


function codeForm(code, index, setState, disable, DoOnChange){
    return(
    <InputGroup hasValidation className="mb-3" key={index}>

        <FloatingLabel controlId="floatingInput" label="Oprations kod">
            <Form.Control required pattern = "[a-zA-zåäöÅÄÖ]{2}[0-9]{4}"  
                          disabled={disable} type="input" maxLength={6} 
                          value={disable ? '' : code} onChange={(e) => {updateList(index, e.target.value, setState); DoOnChange()}} />
            
            <Form.Control.Feedback type="invalid">
                Please provide a valid code(2 letter followed by 4 digits).
            </Form.Control.Feedback>
        </FloatingLabel>


        <Button variant="outline-danger" id="button-addon" 
                onClick={(e) => {removeList(index, setState); DoOnChange()}}>
          Remove
        </Button>
        
      </InputGroup>
    );
}

    
function OprationsKod(codes, setCodes, DoOnChange, disable=true) {

    return (
        <Form.Group className="mb-3" controlId="formOprationKod" >
            <Form.Group controlId="formOprationKoder">
                
            <Form.Label>Codes (only for Kirugi):</Form.Label>
                {
                    codes.map((code, index) => {
                        return codeForm(code, index, setCodes, disable, DoOnChange);
                    })
                }
            </Form.Group>

            
            <Form.Group  controlId="formOprationKodNy">
                <Button variant="primary"  disabled={disable} onClick={() => {setCodes(prev => [...prev,'']); 
                                                                              DoOnChange()}}>Add Code</Button>
            </Form.Group>
        </Form.Group>
    );     
}




export default OprationsKod;
