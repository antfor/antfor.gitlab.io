import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { simplifyValue } from '../utils/parse.js';
import styles from './result.module.css'; 
import { DoughnutChart } from './doughnutChart.jsx';
import { Total } from './Total.jsx';



function getColor(dataset){
    return ({color:  dataset.backgroundColor});
}
  

function paragraph(dataset, index, tot){
    const label = dataset.label;
    const value = dataset.data[index];
    const data = simplifyValue(value, 0);
    const percent = simplifyValue(value*100.0/tot, 0);
    return(
        <Col md={6} key={label}>
            <p className={styles.resultat}> {label}: <span className={styles.nowrap} style={getColor(dataset)}>{data} kr ({percent}%)</span></p>
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

function Brake(arr){
    if(arr.length!==0)
        return <br className='d-md-none'/>;
}

export default function Result(datasets, total, index, dataPoints){
    
    
    const isEmpty = datasets.length === 0;
    if(isEmpty){
        return (emptyResult());
    }

    const acc = datasets.filter((dataset) => !dataset.intrest);
    const intrest = datasets.filter((dataset) => dataset.intrest && !dataset.intrestOnIntrest);
    const intrestIntrest = datasets.filter((dataset) => dataset.intrest && dataset.intrestOnIntrest);

    return(
        <Col>
            <Row className="row justify-content-between">
                <Col xl={9} className='col-xl'>
                <h2>Resultat</h2>
                    <p>Slutsumma: {simplifyValue(total,0)} kr (100%)</p>
                    {Brake(intrestIntrest)}
                    <Row>
                        {intrestIntrest.map((dataset) => paragraph(dataset, index, total))}
                    </Row>
                    {Brake(intrest)}
                    <Row>
                        {intrest.map((dataset) => paragraph(dataset, index, total))}
                    </Row>
                    {Brake(acc)}
                    <Row>
                        {acc.map((dataset) => paragraph(dataset, index, total))}
                    </Row>
                    <br/>
                    {Total(dataPoints, total, index)}
                </Col>

                <Col xl={3} className='col-xl'>
                  {DoughnutChart(datasets, index, total)}
                </Col>
            </Row>
        </Col>
    );
}

  