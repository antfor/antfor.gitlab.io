import Form from 'react-bootstrap/Form';
import styles from './settings.module.css';
import { Interval, IntervalMap } from '../InterestChart.jsx';
import { interestSettings, breakdownSettings } from './defaultSettings.js';
import { InterestForms } from './components/InterestForms.jsx';
import { DropdownInterval } from './components/DropdownInterval.jsx';
import { BreakDownToggle } from './components/BreakDownToggle.jsx';

type key<T> = keyof T

interface propsFormGroup {
    label: string | React.JSX.Element,
    id: string,
    children: React.JSX.Element,
}
function FormGroup({ id, label, children }: propsFormGroup) {
    return (
        <Form.Group controlId={id}>
            <Form.Label>{label}</Form.Label>
            {children}
        </Form.Group>
    );
}


interface propsSettings {
    interestSettings: interestSettings,
    breakdownSettings: breakdownSettings
    updateInterest: (k: key<interestSettings>, v: (string | Interval)) => void,
    updateBreakdown: (k: key<breakdownSettings>, v: boolean) => void,
    intervalMap: IntervalMap,
}
function SettingsComponent({ interestSettings, updateInterest, breakdownSettings, updateBreakdown, intervalMap }: propsSettings) {

    type formProps = { keyInterest: key<interestSettings>, decimals: number, style: string };
    const interest: formProps = { keyInterest: "interest", style: styles.m3, decimals: 2 };
    const startMoney: formProps = { keyInterest: "startMoney", style: styles.m4, decimals: 2 };
    const monthlySaving: formProps = { keyInterest: "monthlySaving", style: styles.m4, decimals: 2 };
    const time: formProps = { keyInterest: "time", style: styles.m2, decimals: 0 };

    const getFormProps = (fp: formProps) => ({ settings: interestSettings, change: updateInterest, ...fp });

    const setInterval = (i: Interval) => { updateInterest("Interval", i) };

    return (
        <Form>
            <FormGroup id={interest.keyInterest + "-FormGroup"} label="Ränta per år (%)">
                <InterestForms {...getFormProps(interest)} />
            </FormGroup>
            <br />
            <FormGroup id={startMoney.keyInterest + "-FormGroup"} label="Startbelopp (kr)">
                <InterestForms {...getFormProps(startMoney)} />
            </FormGroup>
            <br />
            <FormGroup id={monthlySaving.keyInterest + "-FormGroup"} label="Månadssparande (kr/mån)">
                <InterestForms {...getFormProps(monthlySaving)} />
            </FormGroup>
            <br />
            <FormGroup id={time.keyInterest + "-FormGroup"} label={DropdownInterval({ iMap: intervalMap, change: setInterval })}>
                <InterestForms {...getFormProps(time)} />
            </FormGroup>
            <br />
            <FormGroup id="Breakdown-FormGroup" label="Breakdown">
                <BreakDownToggle settings={breakdownSettings} setSettings={updateBreakdown} />
            </FormGroup>
        </Form>
    )
}

export { SettingsComponent };
