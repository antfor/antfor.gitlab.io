import { useState, useRef, Dispatch, SetStateAction } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { FormGroup, Tooltip } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { orm } from '../orm/orm.mjs'
import { isValidReps, isValidWeight, IsRefMonted, isNaNoE } from './input.mts';
import { Increment } from './Increment';
import './input.css';

interface FormElements extends HTMLFormControlsCollection {
  weight: HTMLInputElement,
  reps: HTMLInputElement
  increment: HTMLInputElement
}
interface InputFormElement extends HTMLFormElement {
  readonly elements: FormElements
}
type setReact<T> = Dispatch<SetStateAction<T>>
interface Submit {
    weight: number|string,
    reps: number|string,
    validInputs:boolean,
    setInputs:((w:number, r:number)=>void),
    setValidated:setReact<boolean>,
    e: React.FormEvent<InputFormElement>,
}
function handleSubmit(props:Submit) {

        props.e.preventDefault();
    
        if (props.validInputs) {

            props.setValidated(false);
            props.setInputs(Number(props.weight), Number(props.reps))
        }else{

            props.e.stopPropagation();
            props.setValidated(true);
        }
};

interface input {
    increment:number,
    Iweight?:number|string,
    Ireps?:number|string,
    maxRep?:number, 
    setIncrement:((i:number)=>void),
    setInputs:((w:number, r:number)=>void),
}

export function Input({increment, Iweight="", Ireps="", maxRep=20, setIncrement, setInputs}:input){
    
    const [validated, setValidated] = useState(false);
    const [weight, setInputWeight] = useState(Iweight);
    const [reps, setInputReps] = useState(Ireps);
    
    const refMounted= useRef(null);
    const mounted = IsRefMonted(refMounted);
    
    const setInput = (c:((n:string)=>void)) => (e:React.ChangeEvent<HTMLInputElement>)=> {c(e.target.value)};

    const maxwWight = 2205;
    const validWeight = isValidWeight(weight, maxwWight)
    const validReps = isValidReps(reps);
    

    const tooltipText = `ORM: ${validWeight && validReps ? orm(Number(weight), Number(reps)) : ""}`;
    const weightError = (isNaNoE(weight) || Number(weight) < 1) ? "Weight ≥ 1kg":`Weight ≤ ${maxwWight.toString()}kg`;


    const submit = (e: React.FormEvent<InputFormElement>) => 
                {handleSubmit({
                    weight: weight, reps: reps, validInputs: validWeight && validReps,
                    setInputs: setInputs, setValidated: setValidated, e:e
                })}

    return(
        <Form noValidate onSubmit={submit}> 
        
            <Stack direction="horizontal" gap={3} className='justify-content-center align-items-start'> 
            
                <FormGroup>
                    <Form.Label htmlFor="weight">Weight:</Form.Label>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="orm-auto">{tooltipText}</Tooltip>}
                        show={mounted && validWeight && validReps}
                    >
                        <Form.Control ref={refMounted} value={weight} id="weight" isInvalid={validated && !validWeight} type="number" inputMode="decimal" min={0} step={increment} max={100000} onChange={setInput(setInputWeight)}/>                   
                    </OverlayTrigger>
                    <Form.Control.Feedback type="invalid">{weightError}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup>
                    <Form.Label htmlFor="reps">Reps:</Form.Label>
                    <Form.Control value={reps} id="reps" isInvalid={validated && !validReps} type="number" inputMode="numeric" min={1} max={maxRep} onChange={setInput(setInputReps)}/>
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