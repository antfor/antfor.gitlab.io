import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    round
  } from 'mathjs'
import styles from './intrest.module.css'; 

function formatValue(value, decimals) {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(round(value, decimals));
  }

function getColor(dataset){
    return ({color:  dataset.backgroundColor});
}
  

function paragraph(dataset, index, tot){
    const label = dataset.label;
    const data = dataset.data[index];
    const percent = data/tot*100;
    return(
        <Col key={label}>
            <p className={styles.resultat}>{label}: <span style={getColor(dataset)}>{formatValue(data,0)} kr ({formatValue(percent,0)}%) </span></p>
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
            <p>Slutsumma: {formatValue(total,0)} kr (100%)</p>
            <Row className="row-cols-auto">
                {intrest.map((dataset) => paragraph(dataset, index, total))}
            </Row>
            <Row className="row-cols-auto">
                {acc.map((dataset) => paragraph(dataset, index, total))}
            </Row>
        </div>
    );
}
  
  

  