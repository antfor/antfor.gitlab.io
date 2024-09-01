import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { simplifyValue } from '../utils/parse.js';
import styles from './result.module.css'; 


function getColor(value,total){
    const col0 =[106,168,79];
    const col1 =[182,215,168];

    if(total == 0){
        return {color: `rgb(${col1[0]},${col1[1]},${col1[2]})`};
    }

    const percent = value* 1.0/total;

    const col = col0.map((col0, i) => col0 * percent + col1[i] * (1-percent));

    return {color: `rgb(${col[0]},${col[1]},${col[2]})`};
}


function paragraph(label, value, total){

    const percent = simplifyValue(value*100.0/total, 0);
    const data = simplifyValue(value, 0);
    
    return(
        <Col md={6}>
            <p className={styles.resultat}>{label}: <span style={getColor(value,total)} className={styles.nowrap}> {data} kr ({percent}%)</span></p>
        </Col>
    );
}

function totalPrincipal(dataPoints, index){

    const p = dataPoints.accPrincipel[index];
    const ip = dataPoints.intrestPrincipel[index];
    const iip = dataPoints.intrestIntrestPrincipal[index];

    return p + ip + iip;
}

export function Total(dataPoints, total, index){
   
    const totalFromPrincipal = totalPrincipal(dataPoints, index);
    const totalFromMonthly = total - totalFromPrincipal;

    if(totalFromPrincipal == 0 || totalFromMonthly == 0){
        return;
    }

    return(
        <Row>
            {paragraph("Totalt startbelopp", totalFromPrincipal, total)}
            {paragraph("Totalt månadssparande", totalFromMonthly, total)}
        </Row>
    );
}