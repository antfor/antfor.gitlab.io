import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import styles from './settings.module.css'; 
import Button from 'react-bootstrap/Button';
import { Interval, IntervalMap } from '../IntrestChart.tsx';
import { Value, intrestSettings,breakdownSettings } from './defultSettings.ts';

type key<T> = keyof T
type change = (v:string) => void;

function Buttons({value, change}:{value:Value, change:change}){

   const val = value.getNumber();
   const step = value.step;
   const minVal = value.minCoarseControl;
   const maxVal = value.maxFineControl;
   const onClick = (v:number) => {change(v.toString())};
    
    return(
        <InputGroup className="btn-group">
                <Button disabled={val===minVal} variant="outline-danger"  className={styles.button} onClick={()=>{onClick(val-step)}}>-</Button>
                <Button disabled={val===maxVal} variant="outline-primary" className={styles.button} onClick={()=>{onClick(val+step)}}>+</Button>
        </InputGroup>
    );
}

function SliderForm({value, decimals, style, change}:{value:Value, decimals:number, style:string, change:change}){

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {change(e.target.value)};
    const startValue = value.getFormatValue(decimals);
    const min = value.minCoarseControl;
    const max = value.maxCoarseControl;
    const step = value.step;
   
    return(
        <Stack gap={2}>
            <Stack direction="horizontal" gap={3}>
                   <Form.Control className={style} type="text" inputMode="decimal" value={startValue} onChange={onChange} />
                   <Buttons value={value} change={change}/>
            </Stack>
            <Form.Range value={value.getNumber()} min={min} max={max} step={step} onChange={onChange} /> 
        </Stack>
    );
}

type keyIntrest = keyof intrestSettings;
interface propsIntrestForm{
    settings: intrestSettings,
    keyIntrest: keyIntrest,
    decimals:number,
    style:string,
    change:(k:keyIntrest, v:string) => void,
}
function IntrestForms({settings,keyIntrest,decimals,style,change}:propsIntrestForm){
   
    const value = settings[keyIntrest] as Value;
    const props = {value, decimals, style, change:(v:string) => {change(keyIntrest, v)}};

    return(
        <SliderForm {...props}/>
    );

    
}

interface propsBreakDown{
    settings: breakdownSettings,
    setSettings: (k:key<breakdownSettings>,v:boolean) => void,
}
function BreakDownToggle({settings, setSettings}:propsBreakDown){

    const type = 'checkbox';
    const ib = settings.intrestBreakdown;
    const ab = settings.accBreakdown;
    const iib = settings.intrestOnIntrestBreakdown;

    const key_ib = "intrestBreakdown";
    const key_ab = "accBreakdown";
    const key_iib = "intrestOnIntrestBreakdown";

    return(
        <InputGroup className="xs-auto">

        <div key={`default-${type}`}>
            
            <Stack direction="horizontal" gap={5}>
                <Form.Check 
                    type={type}
                    checked={ib}
                    id={`intrest`}
                    label={`info ränta`}
                    onChange={(e) => {setSettings(key_ib,e.target.checked)}}
                />
                <Form.Check 
                    type={type}
                    checked={iib}
                    disabled={!ib}
                    id={`intrestIntrest`}
                    label={`info ränta på ränta`}
                    onChange={(e) => {setSettings(key_iib,e.target.checked)}}
                />
            </Stack>
            <br/>
            <Form.Check 
                type={type}
                checked={ab}
                id={`acc`}
                label={`info insättning`}
                onChange={(e) => {setSettings(key_ab,e.target.checked)}}
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
    children: React.JSX.Element,
}
function FormGroup({label, children}:propsFormGroup){
    return(
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {children}
        </Form.Group>
    );
}


interface propsSettings{
    intrestSettings: intrestSettings,
    breakdownSettings: breakdownSettings
    updateIntrest: (k:key<intrestSettings>,v:(string|Interval) ) => void,
    updateBreakdown: (k:key<breakdownSettings>,v:boolean) => void,
    intervalMap: IntervalMap,
}
function SettingsComponent({intrestSettings, updateIntrest, breakdownSettings, updateBreakdown, intervalMap}:propsSettings){

    type formProps = {keyIntrest:keyIntrest, decimals:number, style:string};
    const intrest:formProps = {keyIntrest:"intrest", style: styles.m3, decimals:2};
    const startMoney:formProps = {keyIntrest:"startMoney", style: styles.m4, decimals:2};
    const monthlySaving:formProps = {keyIntrest:"monthlySaving", style: styles.m4, decimals:2};
    const time:formProps = {keyIntrest:"time", style: styles.m2, decimals:0};
    
    const getFormProps = (fp:formProps) => ({settings: intrestSettings, change: updateIntrest, ...fp});

    const setInterval = (i:Interval) => {updateIntrest("Interval",i)};

    return (
        <Form>
            <FormGroup label="Ränta per år (%)">
                <IntrestForms {...getFormProps(intrest)}/>
            </FormGroup>
            <br/>
            <FormGroup label="Startbelopp (kr)">
                <IntrestForms {...getFormProps(startMoney)}/>
            </FormGroup>
            <br/>
            <FormGroup label="Månadssparande (kr/mån)">
                <IntrestForms {...getFormProps(monthlySaving)}/>
            </FormGroup>
            <br/>
            <FormGroup label={DropdownInterval({iMap:intervalMap, change:setInterval})}>
                <IntrestForms {...getFormProps(time)}/>
            </FormGroup>
            <br/>
            <FormGroup label="Breakdown">
                <BreakDownToggle settings={breakdownSettings} setSettings={updateBreakdown}/>
            </FormGroup>
      </Form>
    )
}

export {SettingsComponent};
