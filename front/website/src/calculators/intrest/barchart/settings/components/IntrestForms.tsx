import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import styles from '../settings.module.css'; 
import Button from 'react-bootstrap/Button';
import { Value, intrestSettings } from '../defultSettings.ts';
import { formatValue } from '../../utils/parse.mts';


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
export function IntrestForms({settings, keyIntrest, decimals, style, change}:propsIntrestForm){
   
    const value = settings[keyIntrest] as Value;
    const props = {value, decimals, style, change:(v:string) => {change(keyIntrest, formatValue(v, decimals))}};

    return(
        <SliderForm {...props}/>
    );

    
}

