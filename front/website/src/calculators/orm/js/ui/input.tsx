import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { FormGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const isNaNoE = (value:(number|string)) => isNaN(Number(value)) || value === "";
const ifIsNum = (n:string,f:(n:number)=>void) => {if(!isNaNoE(n)){f(Number(n))}};
const onChange = (c:((n:number)=>void)) => (e:React.ChangeEvent<HTMLInputElement>)=>{ifIsNum(e.target.value, c)};
//type Increment = (0|1|1.25|2.5|5);

function Increment({increment, setIncrement}:{increment:number, setIncrement:((i:number)=>void)}){

    const values = [0,1,1.25,2.5,5];
    const start  = values.indexOf(increment)===-1 ? 0 : values.indexOf(increment); 
    
    return(
        <FormGroup>
            <Form.Label >Weight increment:</Form.Label>
             <div className="range-wrapper">
            
                <div className="track-markers">
                    {values.map((_, i) => 
                        <div key={i} className={`track-node`}/>
                    )}
                </div> 
                <Form.Range id="increment" list="values" onChange={onChange(i => {setIncrement(values[i])})} value={start} min={0} max={values.length-1} step={1}/> 
                <datalist id="values">
                    <option value="0" label="0kg"></option>
                    <option value="1" label="1kg"></option>
                    <option value="1.25" label="1.25kg"></option>
                    <option value="2.5" label="2.5kg"></option>
                    <option value="5" label="5kg"></option>
                </datalist>
                
                <Stack direction="horizontal" gap={2} className={`justify-content-between`}>
                    {/*values.map((v,i) => <h6 key={i}>{v}kg</h6>)*/}
                </Stack>
            </div>
        </FormGroup>
    );
}

interface FormElements extends HTMLFormControlsCollection {
  weight: HTMLInputElement,
  reps: HTMLInputElement
  increment: HTMLInputElement
}
interface InputFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

interface input {
    increment:number,
    Iweight?:number|string,
    Ireps?:number|string,
    maxRep?:number, 
    setIncrement:((i:number)=>void),
    setWeight:((w:number)=>void),
    setReps:((w:number)=>void),
}


type Maybe<T>=(T|"");
type Settings = {
    weight:Maybe<number>,
    reps:Maybe<number>,
}
export function Input({increment, Iweight="", Ireps="", maxRep=20, setIncrement, setWeight, setReps}:input){
    
    const [validated, setValidated] = useState(false);

    const [weight, setInputWeight] = useState(Iweight);
    const [reps, setInputReps] = useState(Ireps);

    const setInput = (c:((n:string)=>void)) => (e:React.ChangeEvent<HTMLInputElement>)=> {c(e.target.value)};

    const handleSubmit=(e: React.FormEvent<InputFormElement>) => {

        e.preventDefault();
        const form = e.currentTarget;
        const weightValue = form.elements.weight.value;
        const repValue = form.elements.reps.value;
    
        if (validWeight(weightValue) && validReps(repValue)) {

            setValidated(false);
            setWeight(Number(weightValue));
            setReps(Number(repValue));
        }else{
            
            e.stopPropagation();
            setValidated(true);
        }
        
    };
        
    
    const validWeight = (w:(number|string)) => !isNaNoE(w) && 1<=Number(w) && Number(w) <= 1000;
    const validReps = (r:(number|string)) => !isNaNoE(r) && 1 <= Number(r) && Number(r) <= 20;
    
    return(
        <Form noValidate onSubmit={handleSubmit}> 
        
            <Stack direction="horizontal" gap={3} className='justify-content-center align-items-start'> 
            
                <FormGroup>
                    <Form.Label >Weight:</Form.Label>
                    <Form.Control id="weight" isInvalid={validated && !validWeight(weight)} type="number" inputMode="decimal" min={0} step={increment} max={100000} onChange={setInput(setInputWeight)}/>
                    <Form.Control.Feedback type="invalid">Weight ≥ 1kg</Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                    <Form.Label>Reps:</Form.Label>
                    <Form.Control id="reps" isInvalid={validated && !validReps(reps)} type="number" inputMode="numeric" min={1} max={maxRep} onChange={setInput(setInputReps)}/>
                    <Form.Control.Feedback type="invalid">Reps: 1-20</Form.Control.Feedback>
                </FormGroup>
            </Stack>
            <br/>
            <Stack direction="horizontal" gap={3} className='justify-content-around'> 
                <Increment increment={increment} setIncrement={setIncrement}/>
                <Button type="submit" className='snake-col'>Submit</Button>
            </Stack>

        </Form>
    );
}


     /*
                <Form.Select aria-label="Default select example">
                    <option></option>
                    {Array.from({ length: maxRep}, (_,i)=> <option key={i+1} value={i+1} >{i+1}</option>)}
                </Form.Select>
                */