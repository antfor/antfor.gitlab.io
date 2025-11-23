import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { FormGroup, Tooltip } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { orm } from '../orm.mts'

const isNaNoE = (value:(number|string)) => isNaN(Number(value)) || value === "";
const ifIsNum = (n:string,f:(n:number)=>void) => {if(!isNaNoE(n)){f(Number(n))}};
const onChange = (c:((n:number)=>void)) => (e:React.ChangeEvent<HTMLInputElement>)=>{ifIsNum(e.target.value, c)};

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
                <Form.Range id="increment" list="rangeLabels" onChange={onChange(i => {setIncrement(values[i])})} value={start} min={0} max={values.length-1} step={1}/> 
                <datalist id="rangeLabels">
                    {values.map((v,i)=><option value={i} key={i} label={`${v.toString()} kg`}></option>)}
                </datalist>       
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
    setInputs:((w:number, r:number)=>void),
}


export function Input({increment, Iweight="", Ireps="", maxRep=20, setIncrement, setInputs}:input){
    
    const [validated, setValidated] = useState(false);

    const [weight, setInputWeight] = useState(Iweight);
    const [reps, setInputReps] = useState(Ireps);
    
    const mounted = IsMounted();
    
    const setInput = (c:((n:string)=>void)) => (e:React.ChangeEvent<HTMLInputElement>)=> {c(e.target.value)};

    const handleSubmit=(e: React.FormEvent<InputFormElement>) => {

        e.preventDefault();
    
        if (validWeight && validReps) {

            setValidated(false);
            setInputs(Number(weight), Number(reps))
        }else{

            e.stopPropagation();
            setValidated(true);
        }
    };
        
    const maxwWight = 2205;
    const validWeight = !isNaNoE(weight) && 1<=Number(weight) && Number(weight) <= maxwWight;
    const validReps = !isNaNoE(reps) && 1 <= Number(reps) && Number(reps) <= 20;
    
    const tooltipText = `ORM: ${validWeight && validReps ? orm(Number(weight), Number(reps)) : ""}`;

    return(
        <Form noValidate onSubmit={handleSubmit}> 
        
            <Stack direction="horizontal" gap={3} className='justify-content-center align-items-start'> 
            
                <FormGroup>
                    <Form.Label >Weight:</Form.Label>

                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="orm-auto">{tooltipText}</Tooltip>}
                        show={mounted && validWeight && validReps}
                    >
                        {({ ref }) => 
                            <Form.Control ref={ref} value={weight} id="weight" isInvalid={validated && !validWeight} type="number" inputMode="decimal" min={0} step={increment} max={100000} onChange={setInput(setInputWeight)}/>}          
                    </OverlayTrigger>
                    <Form.Control.Feedback type="invalid">{(isNaNoE(weight) || Number(weight) < 1) ? "Weight ≥ 1kg":`Weight ≤ ${maxwWight.toString()}kg`}</Form.Control.Feedback>
                </FormGroup>

                <FormGroup>
                    <Form.Label>Reps:</Form.Label>
                    <Form.Control value={reps} id="reps" isInvalid={validated && !validReps} type="number" inputMode="numeric" min={1} max={maxRep} onChange={setInput(setInputReps)}/>
                    <Tooltip id="orm-auto">{tooltipText}</Tooltip>
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


//todo fix use ref on Form.Control
function IsMounted() {
    const [mounted, setMounted] = useState(false);
    const refMounted = useRef(false);

    useEffect(()=>{
        if(!refMounted.current)
            refMounted.current = true;
        return ()=>{refMounted.current = false;}
    },[]);

    useEffect(()=>{
        setMounted(refMounted.current);
    },[refMounted]);

    return mounted;
}