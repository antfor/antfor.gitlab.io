import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import styles from './intrest.module.css'; 
import { floor,min } from 'mathjs';


function sliderForm(startValue, min, max, change, step=1, style=styles.m2, max2=max){

    return(
        <InputGroup className="d-flex flex-column">
            <Stack direction="horizontal" gap={3}>
                <Form.Control className={style} type="number" value={startValue} min={min} max={max2} step={step} onChange={change} />
                
                <Form.Range value={startValue} min={min} max={max} step={step} onChange={change} /> 
            </Stack>

        </InputGroup>
    );
}

function formatValue(value, decimals) {
    return(floor(parseFloat(value), decimals));
  }

function räntaForm(intrest, setIntrest){

    let startValue = formatValue(intrest, 2);
    return( sliderForm(startValue, 0, 20, (e) => setIntrest(""+parseFloat(e.target.value)), 0.01, styles.m3 ));
}

function startForm(startMoney, setStartMoney){

    let startValue  = formatValue(startMoney, 2);
    return(sliderForm(startValue, 0, 10000, (e) => setStartMoney(""+parseFloat(e.target.value)), 100, styles.m4, "any"));   
}

function sparForm(spar, setSpar){

    let startValue  = formatValue(spar, 2);
    return(sliderForm(startValue, 0, 10000, (e) => setSpar(""+parseFloat(e.target.value)), 100, styles.m4, "any"));
}

function tidForm(time, setTime){

    let startValue  = min(formatValue(time, 0),100);
    return(sliderForm(startValue, 1, 30, (e) => setTime(""+ min(floor(parseFloat(e.target.value),0),100)), 1, styles.m2, 100));
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


function SettingsComponent(settings, setSettings) {
    
    let setRänta = (v) => {setSettings(prev => ({...prev, intrest: v}))};
    let setStart = (v) => {setSettings(prev => ({...prev, startMoney: v}))};
    let setSpar = (v) => {setSettings(prev => ({...prev, monthlySaving: v}))};
    let setTid = (v) => {setSettings(prev => ({...prev, time: v}))};

    let setIntrestBreakDown = (v) => {setSettings(prev => ({...prev, intrestBreakdown: v}))};
    let setAccBreakDown = (v) => {setSettings(prev => ({...prev, accBreakdown: v}))};


    return (
        <Form>
            <Form.Label>Ränta per år (%)</Form.Label>
            {räntaForm(settings.intrest, setRänta)}

            <Form.Label>startbelopp (kr)</Form.Label>
            {startForm(settings.startMoney, setStart)}

            <Form.Label>månadssparande (kr/mån)</Form.Label>
            {sparForm(settings.monthlySaving, setSpar)}

            <Form.Label>Tid (år)</Form.Label>
            {tidForm(settings.time, setTid)}

            <Form.Label>Breakdown </Form.Label>
            {breakDownToggle(setIntrestBreakDown, setAccBreakDown)}

      </Form>
    )
}

export {SettingsComponent};




