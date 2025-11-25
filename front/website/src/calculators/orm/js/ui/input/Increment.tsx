import Form from 'react-bootstrap/Form';
import { FormGroup } from 'react-bootstrap';
import { isNaNoE } from './input.mjs';


function onChange(setNumber:((n:number)=>void)){
    type event = React.ChangeEvent<HTMLInputElement>;
    return (e:event)=>{
        const value = e.target.value;
        if(!isNaNoE(value)){
            setNumber(Number(value))
        }
    };
}

export function Increment({increment, setIncrement}:{increment:number, setIncrement:((i:number)=>void)}){

    const values = [0,1,1.25,2.5,5];
    const start  = values.indexOf(increment)===-1 ? 0 : values.indexOf(increment); 
    
    return(
        <FormGroup>
            <Form.Label htmlFor="increment">Weight increment:</Form.Label>
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