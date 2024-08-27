import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import styles from './intrest.module.css'; 
import { max,min } from 'mathjs';
import {toNumber, formatValue, parseFloatSafe} from './parse.js'
import Button from 'react-bootstrap/Button';

const Any = "any";

function Buttons(startValue, minVal, maxVal, change, step){

    const value = parseFloatSafe(startValue);
    const minMaxAny = (mmfun,mmval,val) => mmval === Any ? val : mmfun(mmval,val);
    const onClick = (v) => {change({target: {value: minMaxAny(max,minVal,minMaxAny(min,maxVal,v)).toString()}})};
    
    return(
        <InputGroup className="btn-group">
                <Button disabled={value===minVal} variant="outline-danger"  className={styles.button} onClick={()=>onClick(value-step)}>-</Button>
                <Button disabled={value===maxVal} variant="outline-primary" className={styles.button} onClick={()=>onClick(value+step)}>+</Button>
        </InputGroup>
    );
}

function sliderForm(startValue, min, max, change, step=1, style=styles.m2, maxControl=max, stepControl=step){

    return(
        <Stack gap="2">
            <Stack direction="horizontal" gap="3">
                   <Form.Control className={style} type="text" inputMode="decimal" pattern="[0-9]*.?[0-9]*" value={startValue} min={min} max={maxControl} step={stepControl} onChange={change} />
                   {Buttons(startValue, min, maxControl, change, step)}
            </Stack>
            <Form.Range value={parseFloatSafe(startValue)} min={min} max={max} step={step} onChange={change} /> 
        </Stack>
    );
}

function räntaForm(intrest, setIntrest){

    let startValue = formatValue(intrest, 2);
    return( sliderForm(startValue, 0, 20, (e) => setIntrest(toNumber(e.target.value)), 0.1, styles.m3, Any, 0.01));
}

function startForm(startMoney, setStartMoney){

    let startValue  = formatValue(startMoney, 2);
    return(sliderForm(startValue, 0, 10000, (e) => setStartMoney(toNumber(e.target.value)), 100, styles.m4, Any));   
}

function sparForm(spar, setSpar){

    let startValue  = formatValue(spar, 2);
    return(sliderForm(startValue, 0, 10000, (e) => setSpar(toNumber(e.target.value)), 100, styles.m4, Any));
}

function tidForm(time, setTime){

    let startValue = "";
    if(time !== "")
        startValue  = min(formatValue(time, 0),100);
    
    return(sliderForm(startValue, 0, 30, (e) => setTime(toNumber(e.target.value)), 1, styles.m2, 100));
}

function breakDownToggle(setIntrestBreakDown, setAccBreakDown){

    let type = 'checkbox';
    return(
        <InputGroup className="xs-auto">

        <div key={`default-${type}`} className="mb-3">
            
            <Form.Check 
                type={type}
                id={`intrest`}
                label={`info ränta`}
                onChange={(e) => setIntrestBreakDown(e.target.checked)}
            />

            <Form.Check 
                type={type}
                id={`acc`}
                label={`info insättning`}
                onChange={(e) => setAccBreakDown(e.target.checked)}
            />
        
        </div>
        </InputGroup>
    );
}

function DropdownCoumpound(crMap, change){

    const option = (key, value) => <option key={key} value={key}>{value}</option>; 

    return(
        <Stack direction="horizontal" gap="1"> 
        {"Tid ("}
        <Form.Select onChange={(e) => change(e.target.value)} className={styles.dropdown}>
            {Array.from(crMap.entries(),([key, value]) => option(key, value))}
        </Form.Select>
        {")"}
        </Stack>
    );
}

function FormGroup(label, form){
    return(
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {form}
        </Form.Group>
    );
}

function SettingsComponent(settings, setSettings, compoundRateMap){
    
    const setRänta = (v) => {setSettings(prev => ({...prev, intrest: v}))};
    const setStart = (v) => {setSettings(prev => ({...prev, startMoney: v}))};
    const setSpar = (v) => {setSettings(prev => ({...prev, monthlySaving: v}))};
    const setTid = (v) => {setSettings(prev => ({...prev, time: v}))};
    const setCompoundRate = (v) => {setSettings(prev => ({...prev, compoundRate: v}))};

    const setIntrestBreakDown = (v) => {setSettings(prev => ({...prev, intrestBreakdown: v}))};
    const setAccBreakDown = (v) => {setSettings(prev => ({...prev, accBreakdown: v}))};

    //todo clean up
    return (
        <Form>
            {FormGroup("Ränta per år (%)",räntaForm(settings.intrest, setRänta))}
            <br/>
            {FormGroup("Startbelopp (kr)", startForm(settings.startMoney, setStart))}
            <br/>
            {FormGroup("Månadssparande (kr/mån)", sparForm(settings.monthlySaving, setSpar))}
            <br/>
            {FormGroup(DropdownCoumpound(compoundRateMap, setCompoundRate), tidForm(settings.time, setTid))}
            <br/>
            {FormGroup("Breakdown ", breakDownToggle(setIntrestBreakDown, setAccBreakDown))}
            <br/>
      </Form>
    )
}

export {SettingsComponent};




