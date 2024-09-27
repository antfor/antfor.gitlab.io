import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { simplifyValue } from '../utils/parse.mts';
import styles from './result.module.css'; 
import { Savings } from '../utils/intrest.mts';


function getColor(value:number,total:number){
    const col0 =[106,168,79];
    const col1 =[182,215,168];

    if(total == 0){
        return {color: `rgb(${col0.join(',')})`};
    }

    const percent = value* 1.0/total;

    const col = col0.map((col0, i) => col0 * percent + col1[i] * (1-percent));

    return {color: `rgb(${col.join(',')})`};
}


function Paragraph(label:string, value:number, total:number){

    const percent = simplifyValue(value*100.0/total, 0);
    const data = simplifyValue(value, 0);
    
    return(
        <Col md={6}>
            <p className={styles.resultat}>{label}: <span style={getColor(value,total)} className={styles.nowrap}> {data} kr ({percent}%)</span></p>
        </Col>
    );
}

function totalPrincipal(dataPoints:Savings, index:number){

    const p = dataPoints.accPrincipel[index];
    const ip = dataPoints.intrestPrincipel[index];
    const iip = dataPoints.intrestIntrestPrincipal[index];

    return p + ip + iip;
}

interface props{
    dataPoints:Savings,
    total:number,
    index:number
}
export function Total({dataPoints, total, index}:props){
   
    const totalFromPrincipal = totalPrincipal(dataPoints, index);
    const totalFromMonthly = total - totalFromPrincipal;

    if(totalFromPrincipal == 0 || totalFromMonthly == 0){
        return;
    }

    return(
        <Row>
            {Paragraph("Totalt startbelopp", totalFromPrincipal, total)}
            {Paragraph("Totalt månadssparande", totalFromMonthly, total)}
        </Row>
    );
}