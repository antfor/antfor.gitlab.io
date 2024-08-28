import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { simplifyValue } from './parse.js';
import styles from './intrest.module.css'; 



function getColor(dataset){
    return ({color:  dataset.backgroundColor});
}
  

function paragraph(dataset, index, tot){
    const label = dataset.label;
    const data = dataset.data[index];
    const percent = data/tot*100;
    return(
        <Col key={label}>
            <p className={styles.resultat}>{label}: <span style={getColor(dataset)}>{simplifyValue(data,0)} kr ({simplifyValue(percent,0)}%) </span></p>
        </Col>
    );
}
  

function emptyResult(){
    return(
        <div>
            <h2>Resultat</h2>
            <p>Slutsumma: 0 kr</p>
        </div>
    );
}

export default function Result(datasets, total, index){
    
    
    const isEmpty = datasets.length === 0;
    if(isEmpty){
        return (emptyResult());
    }

    const intrest = datasets.filter((dataset) => dataset.intrest);
    const acc = datasets.filter((dataset) => !dataset.intrest);

    return(
        <div>
        <h2>Resultat</h2>
            <p>Slutsumma: {simplifyValue(total,0)} kr (100%)</p>
            <Row className="row-cols-auto">
                {intrest.map((dataset) => paragraph(dataset, index, total))}
            </Row>
            <Row className="row-cols-auto">
                {acc.map((dataset) => paragraph(dataset, index, total))}
            </Row>
        </div>
    );
}
  
  

  