import Form from 'react-bootstrap/Form';
import styles from './settings.module.css'; 
import { Interval, IntervalMap } from '../IntrestChart.tsx';
import { intrestSettings,breakdownSettings } from './defultSettings.ts';
import { IntrestForms } from './components/IntrestForms.tsx';
import { DropdownInterval } from './components/DropdownInterval.tsx';
import { BreakDownToggle } from './components/BreakDownToggle.tsx';

type key<T> = keyof T

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

    type formProps = {keyIntrest:key<intrestSettings>, decimals:number, style:string};
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
