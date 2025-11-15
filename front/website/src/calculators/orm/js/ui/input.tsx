import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { FormGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



function Increment(){

    const values = [0,1,1.25,2.5,5];

    const value = 0;
    return(
        <FormGroup>
            <Form.Label >Weight increment:</Form.Label>
             <div className="range-wrapper">
                <Form.Range min={0} max={values.length-1} step={1}/> 
                  <div className="track-markers">
                        {Array.from({ length: values.length }).map((_, i) => (
                        <div
                            key={i}
                            className={`track-node ${i === value ? "active" : ""}`}
                        />
                        ))}
                    </div> 
            </div>
        </FormGroup>
    );
}


export function Input({increment=1, maxRep=20}:{increment?:number, maxRep?:number}){
    
    return(
        <Stack direction="vertical" gap={3}> 
        
            <Stack direction="horizontal" gap={3} className='justify-content-center'> 
            
                <FormGroup>
                    <Form.Label >Weight:</Form.Label>
                    <Form.Control type="number" inputMode="decimal" min={1} step={increment} max={1000}/>
                </FormGroup>
                <FormGroup>
                    <Form.Label>Reps:</Form.Label>
                    <Form.Control type="number" inputMode="numeric" min={1} max={maxRep}/>
                </FormGroup>
            </Stack>

            <Stack direction="horizontal" gap={3} className='justify-content-around'> 
                <Increment/>
                <Button className='snake-col'>Submit</Button>
            </Stack>

        </Stack>
    );
}


     /*
                <Form.Select aria-label="Default select example">
                    <option></option>
                    {Array.from({ length: maxRep}, (_,i)=> <option key={i+1} value={i+1} >{i+1}</option>)}
                </Form.Select>
                */