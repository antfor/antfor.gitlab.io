import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import styles from './settings.module.css'; 
import { max,min } from 'mathjs';
import {toNumber, formatValue, parseFloatSafe} from '../utils/parse.mts'
import Button from 'react-bootstrap/Button';
import { Settings, Interval, IntervalMap } from '../IntrestChart.tsx';

const Any = "any";

function Buttons(startValue:string, minVal:number, maxVal:(typeof Any|number), change:React.ChangeEventHandler<HTMLInputElement>, step:number){

    const value = parseFloatSafe(startValue);
    const minMaxAny = (mmfun:(a0:number,a1:number)=>number,mmval:(typeof Any|number),val:number) => mmval === Any ? val : mmfun(mmval,val);
    const onClick = (v:number) => { //todo fix do not do e.target.value in Xform
        const event = {
            target: {
                value: minMaxAny(max, minVal, minMaxAny(min, maxVal, v)).toString()
            }
        } as React.ChangeEvent<HTMLInputElement>;
        change(event);
    };
    
    return(
        <InputGroup className="btn-group">
                <Button disabled={value===minVal} variant="outline-danger"  className={styles.button} onClick={()=>{onClick(value-step)}}>-</Button>
                <Button disabled={value===maxVal} variant="outline-primary" className={styles.button} onClick={()=>{onClick(value+step)}}>+</Button>
        </InputGroup>
    );
}


function SliderForm(startValue:string, min:number, max:number, change:React.ChangeEventHandler<HTMLInputElement>, step=1, style=styles.m2, maxControl:(typeof Any|number)=max, stepControl=step){

    return(
        <Stack gap={2}>
            <Stack direction="horizontal" gap={3}>
                   <Form.Control className={style} type="text" inputMode="decimal" pattern="[0-9]*.?[0-9]*" value={startValue} min={min} max={maxControl} step={stepControl} onChange={change} />
                   {Buttons(startValue, min, maxControl, change, step)}
            </Stack>
            <Form.Range value={parseFloatSafe(startValue)} min={min} max={max} step={step} onChange={change} /> 
        </Stack>
    );
}

function RäntaForm(intrest:string, setIntrest:(v:string) => void){

    const startValue = formatValue(intrest, 2);
    return(SliderForm(startValue, 0, 20, (e) => {setIntrest(toNumber(e.target.value))}, 0.1, styles.m3, Any, 0.01));
}

function StartForm(startMoney:string, setStartMoney:(v:string) => void){

    const startValue = formatValue(startMoney, 2);
    return(SliderForm(startValue, 0, 10000, (e) => {setStartMoney(toNumber(e.target.value))}, 100, styles.m4, Any));   
}

function SparForm(spar:string, setSpar:(v:string) => void){

    const startValue = formatValue(spar, 2);
    return(SliderForm(startValue, 0, 10000, (e) => {setSpar(toNumber(e.target.value))}, 100, styles.m4, Any));
}

function TidForm(time:string, setTime:(v:string) => void){

    let startValue = "";
    if(time !== "")
        startValue  = min(Number(formatValue(time, 0)),100).toString();
    
    return(SliderForm(startValue, 0, 30, (e) => {setTime(toNumber(e.target.value))}, 1, styles.m2, 100));
}

interface propsBreakDown{
    setIntrestBreakDown: (v:boolean) => void,
    setAccBreakDown: (v:boolean) => void,
    setIIBreakDown: (v:boolean) => void,
    settings: Settings,
}
function BreakDownToggle({setIntrestBreakDown, setAccBreakDown, setIIBreakDown, settings}:propsBreakDown){

    const type = 'checkbox';
    const ib = settings.intrestBreakdown;
    const ab = settings.accBreakdown;
    const iib = settings.intrestOnIntrestBreakdown;
    return(
        <InputGroup className="xs-auto">

        <div key={`default-${type}`}>
            
            <Stack direction="horizontal" gap={5}>
                <Form.Check 
                    type={type}
                    checked={ib}
                    id={`intrest`}
                    label={`info ränta`}
                    onChange={(e) => {setIntrestBreakDown(e.target.checked)}}
                />
                <Form.Check 
                    type={type}
                    checked={iib}
                    disabled={!ib}
                    id={`intrestIntrest`}
                    label={`info ränta på ränta`}
                    onChange={(e) => {setIIBreakDown(e.target.checked)}}
                />
            </Stack>
            <br/>
            <Form.Check 
                type={type}
                checked={ab}
                id={`acc`}
                label={`info insättning`}
                onChange={(e) => {setAccBreakDown(e.target.checked)}}
            />
        
        </div>
        </InputGroup>
    );
}


function DropdownInterval({iMap, change}:{iMap: IntervalMap, change: (v:Interval) => void}){

    const option = (key:Interval, valueS:string) => <option key={key} value={key}>{valueS}</option>; 

    return(
        <Stack direction="horizontal" gap={1}> 
        {"Tid ("}
        <Form.Select onChange={(e) => {change(Number(e.target.value))}} className={styles.dropdown}>
            {Array.from(iMap.entries(),([key, value]) => option(key, value))}
        </Form.Select>
        {")"}
        </Stack>
    );
}

interface propsFormGroup{
    label: string | React.JSX.Element,
    form: React.JSX.Element,
}

function FormGroup({label, form}:propsFormGroup){
    return(
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {form}
        </Form.Group>
    );
}

interface propsSettings{
    settings: Settings,
    setSettings: React.Dispatch<React.SetStateAction<Settings>>,
    intervalMap: IntervalMap,
}

function SettingsComponent({settings, setSettings, intervalMap}:propsSettings){
    
    const setRänta = (v:string) => {setSettings(prev => ({...prev, intrest: v}))};
    const setStart = (v:string) => {setSettings(prev => ({...prev, startMoney: v}))};
    const setSpar = (v:string) => {setSettings(prev => ({...prev, monthlySaving: v}))};
    const setTid = (v:string) => {setSettings(prev => ({...prev, time: v}))};
    const setCompoundRate = (v:Interval) => {setSettings(prev => ({...prev, Interval: v}))};

    const setIntrestBreakDown = (v:boolean) => {setSettings(prev => ({...prev, intrestBreakdown: v}))};
    const setAccBreakDown = (v:boolean) => {setSettings(prev => ({...prev, accBreakdown: v}))};
    const setIIBreakDown = (v:boolean) => {setSettings(prev => ({...prev, intrestOnIntrestBreakdown: v}))};

    return (
        <Form>
            {FormGroup({label:"Ränta per år (%)",form:RäntaForm(settings.intrest, setRänta)})}
            <br/>
            {FormGroup({label:"Startbelopp (kr)", form:StartForm(settings.startMoney, setStart)})}
            <br/>
            {FormGroup({label:"Månadssparande (kr/mån)", form:SparForm(settings.monthlySaving, setSpar)})}
            <br/>
            {FormGroup({label:DropdownInterval({iMap:intervalMap, change:setCompoundRate}), form:TidForm(settings.time, setTid)})}
            <br/>
            {FormGroup({label:"Breakdown", form:BreakDownToggle({setIntrestBreakDown, setAccBreakDown, setIIBreakDown, settings})})}
      </Form>
    )
}

export {SettingsComponent};




