import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import styles from '../settings.module.css'; 
import { Interval } from '../../utils/intrest.mts';


type IntervalMap = Map<Interval,string>


export function DropdownInterval({iMap, change}:{iMap:IntervalMap, change: (v:Interval) => void}){

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